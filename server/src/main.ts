require("dotenv").config();
import path from "path";
import express from "express";
import {serverInfo} from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import {IContact} from "./Contacts";

const app: express.Express = express();
app.use(express.json());

// serve the client
app.use(`/`, express.static(path.join(__dirname, `../../client/dist`)));

// enable CORS so we can call the API from anywhere
app.use((inRequest: express.Request, inResponse: express.Response, inNext: express.NextFunction) => {
    inResponse.header(`Access-Control-Allow-Origin`, `*`);
    inResponse.header(`Access-Control-Allow-Methods`, `GET,POST,DELETE,OPTIONS`);
    inResponse.header(`Access-Control-Allow-Headers`, `Origin,X-Requested-With,Content-Type,Accept`);
    inNext();
});

// get list of contacts
app.get(
    `/contacts`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            inResponse.status(200).json(contacts);
        } catch (inError) {
            console.error(`GET /contacts: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// get contact by id
app.get(
    `/contacts/:id`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.getContact(inRequest.params.id);
            if (!contact) {
                console.warn(`GET /contacts (2): Not Found`, contact);
                inResponse.status(404).send(`not found`);
                return;
            }
            inResponse.status(200).json(contact);
        } catch (inError) {
            console.error(`GET /contacts (2): Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
)

// add a new contact
app.post(
    `/contacts`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const existingContact: IContact | null = await contactsWorker.getContactByEmail(inRequest.body.email);
            if (existingContact) {
                console.warn(`POST /contacts: Duplicate`, inRequest.body);
                inResponse.status(409).send(`duplicate email`);
                return;
            }
            const contact: IContact = await contactsWorker.addContact(inRequest.body);
            inResponse.status(201).json(contact);
        } catch (inError) {
            console.error(`POST /contacts: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// update a contact
app.put(
    `/contacts/:id`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.getContact(inRequest.params.id);
            if (!contact) {
                console.warn(`PUT /contacts: Not Found`);
                inResponse.status(404).send(`not found`);
                return;
            }
            await contactsWorker.updateContact(inRequest.params.id, inRequest.body);
            inResponse.status(204).send(`ok`);
        } catch (inError) {
            console.error(`PUT /contacts: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
)

// delete a contact
app.delete(
    `/contacts/:id`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.getContact(inRequest.params.id);
            if (!contact) {
                console.warn(`DELETE /contacts: Not Found`);
                inResponse.status(404).send(`not found`);
                return;
            }
            await contactsWorker.deleteContact(inRequest.params.id);
            inResponse.status(204).send(`ok`);
        } catch (inError) {
            console.error(`DELETE /contacts: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// get all mailboxes
app.get(
    `/mailboxes`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            inResponse.status(200).json(mailboxes);
        } catch (inError) {
            console.error(`GET /mailboxes: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// get all messages in a mailbox (does NOT include bodies)
app.get(
    `/mailboxes/:mailbox`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: inRequest.params.mailbox
            });
            inResponse.status(200).json(messages);
        } catch (inError) {
            console.error(`GET /mailboxes/mailbox: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// get plain text body of a message in a mailbox
app.get(
    `/messages/:mailbox/:id`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string | undefined = await imapWorker.getMessageBody({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.status(200).send(messageBody);
        } catch (inError) {
            console.error(`GET /messages (3): Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// delete a message
app.delete(
    `/messages/:mailbox/:id`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.status(204).send(`ok`);
        } catch (inError) {
            console.error(`DELETE /messages: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

// send a message
app.post(
    `/messages`,
    async (inRequest: express.Request, inResponse: express.Response) => {
        try {
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
            inResponse.status(201).send(`ok`);
        } catch (inError) {
            console.error(`POST /messages: Error`, inError);
            inResponse.status(500).send(`error`);
        }
    }
);

app.listen(80, () => {
    console.log(`MailBag server open for requests`);
})
