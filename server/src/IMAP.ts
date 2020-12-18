const ImapClient = require("emailjs-imap-client");
import {ParsedMail, simpleParser} from "mailparser";
import {IServerInfo} from "./ServerInfo";

export interface ICallOptions {
    id?: number,
    mailbox: string
}

export interface IMessage {
    body?: string,
    date: string,
    from: string,
    id: string,
    subject: string
}

export interface IMailbox {
    name: string,
    path: string
}

export class Worker {
    private serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        this.serverInfo = inServerInfo;
    }

    private async connectToServer(): Promise<any> {
        const client: any = new ImapClient.default(
            this.serverInfo.imap.host,
            this.serverInfo.imap.port,
            {
                auth: this.serverInfo.imap.auth,
            },
        );
        client.logLevel = client.LOG_LEVEL_NONE;
        client.onerror = (inError: Error) => {
            console.error(`IMAP.Worker.listMailboxes(): Connection error`, inError);
        };
        await client.connect();
        return client;
    }

    public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {
        const client: any = await this.connectToServer();
        await client.deleteMessages(
            inCallOptions.mailbox,
            inCallOptions.id,
            {
                byUid: true,
            },
        );
        await client.close();
    }

    public async listMailboxes(): Promise<IMailbox[]> {
        const client: any = await this.connectToServer();
        const mailboxes: any = await client.listMailboxes();
        await client.close();
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inMailboxes: any[]): void => {
            inMailboxes.forEach((inMailbox: any) => {
                if ((!inMailbox.flags) || inMailbox.flags.indexOf(`\\Noselect`) === -1) {
                    finalMailboxes.push({
                        name: inMailbox.name,
                        path: encodeURIComponent(inMailbox.path),
                    });
                }
                iterateChildren(inMailbox.children);
            });
        };
        iterateChildren(mailboxes.children);
        return finalMailboxes;
    }

    public async getMessageBody(inCallOptions: ICallOptions): Promise<string | undefined> {
        const client: any = await this.connectToServer();
        // noinspection TypeScriptValidateJSTypes
        const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,
            inCallOptions.id,
            [`body[]`],
            {
                byUid: true,
            },
        );
        const parsed: ParsedMail = await simpleParser(messages[0][`body[]`]);
        await client.close();
        return parsed.text;
    }

    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {
        const client: any = await this.connectToServer();
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        const finalMessages: IMessage[] = [];
        if (mailbox.exists === 0) {
            await client.close();
            return finalMessages;
        }
        // noinspection TypeScriptValidateJSTypes
        const messages: any[] = await client.listMessages(inCallOptions.mailbox, `1:*`, [`uid`, `envelope`]);
        await client.close();
        messages.forEach((inMessage: any) => {
            finalMessages.push({
                date: inMessage.envelope.date,
                from: inMessage.envelope.from[0].address,
                id: inMessage.uid,
                subject: inMessage.envelope.subject,
            });
        });
        return finalMessages;
    }
}
