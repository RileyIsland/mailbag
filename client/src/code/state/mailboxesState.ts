import {Component} from "react";
import * as IMAP from "../IMAP";
import * as SMTP from "../SMTP";
import {config} from "../config";

let createMailboxesState = (inParentComponent: Component) => {
    return {
        currentMailbox: null,
        deletingMessage: false,
        gettingMailboxes: false,
        gettingMessages: false,
        gettingMessage: false,
        mailboxes: [],
        messageBody: null,
        messageDate: null,
        messageFrom: null,
        messageID: null,
        messageSubject: null,
        messageTo: null,
        messages: [],
        sendingMessage: false,

        addMailbox: function (inMailbox: IMAP.IMailbox): void {
            const mailboxes: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
            mailboxes.push(inMailbox);
            this.setState({
                mailboxes: mailboxes,
            });
        }.bind(inParentComponent),

        addMessage: function (inMessage: IMAP.IMessage): void {
            const messages = this.state.messages.slice(0);
            messages.push(inMessage);
            this.setState({
                messages: messages,
            });
        }.bind(inParentComponent),

        deleteMessage: async function (): Promise<void> {
            this.setState({
                deletingMessage: true,
                error: null,
            });
            try {
                await ((new IMAP.Worker).deleteMessage(this.state.messageID, this.state.currentMailbox));
                this.setState({
                    currentView: `welcome`,
                    deletingMessage: false,
                    error: null,
                    messages: this.state.messages.filter((inMessage: IMAP.IMessage) => inMessage.id !== this.state.messageID),
                });
            } catch (inError) {
                this.setState({
                    deletingMessage: false,
                    error: `Error deleting message`,
                });
            }
        }.bind(inParentComponent),

        getMailboxes: async function (): Promise<void> {
            this.setState({
                error: null,
                gettingMailboxes: true,
            });
            try {
                (await (new IMAP.Worker()).listMailboxes())
                    .forEach((inMailbox) => {
                        this.state.addMailbox(inMailbox);
                    });
                this.setState({
                    gettingMailboxes: false,
                });
            } catch (inError) {
                this.setState({
                    error: `Error getting mailboxes`,
                    gettingMailboxes: false,
                });
            }
        }.bind(inParentComponent),

        getMessages: async function (inPath: string): Promise<void> {
            this.setState({
                currentMailbox: inPath,
                currentView: `welcome`,
                error: null,
                gettingMessages: true,
                messages: [],
            });
            try {
                (await (new IMAP.Worker()).listMessages(inPath))
                    .forEach((inMessage: IMAP.IMessage) => {
                        this.state.addMessage(inMessage);
                    });
                this.setState({
                    gettingMessages: false,
                });
            } catch (inError) {
                this.setState({
                    error: `Error getting messages`,
                    gettingMessages: false,
                });
            }
        }.bind(inParentComponent),

        sendMessage: async function (): Promise<void> {
            this.setState({
                error: null,
                sendingMessage: true,
            });
            try {
                await (new SMTP.Worker()).sendMessage(
                    this.state.messageTo, this.state.messageFrom, this.state.messageSubject, this.state.messageBody,
                );
                if (this.state.currentMailbox) {
                    await this.getMessages(this.state.currentMailbox);
                }
                this.setState({
                    currentView: `welcome`,
                    messageBody: null,
                    messageDate: null,
                    messageFrom: null,
                    messageID: null,
                    messageSubject: null,
                    messageTo: null,
                    sendingMessage: false,
                });
            } catch (inError) {
                this.setState({
                    error: `Error sending message`,
                    sendingMessage: false,
                });
            }
        }.bind(inParentComponent),

        showComposeMessage: function (inType: string): void {
            switch (inType) {
                case `new`:
                    this.setState({
                        currentView: `compose`,
                        error: null,
                        messageBody: ``,
                        messageFrom: config.userEmail,
                        messageSubject: ``,
                        messageTo: ``,
                    });
                    break;
                case `reply`:
                    this.setState({
                        currentView: `compose`,
                        error: null,
                        messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`,
                        messageFrom: config.userEmail,
                        messageSubject: this.state.messageSubject.replace(/^(re:\s*)+/, `Re: `),
                        messageTo: this.state.messageFrom,
                    });
                    break;
                case `contact`:
                    this.setState({
                        currentView: `compose`,
                        error: null,
                        messageBody: ``,
                        messageFrom: config.userEmail,
                        messageSubject: ``,
                        messageTo: this.state.contactEmail,
                    });
                    break;
            }
        }.bind(inParentComponent),

        showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
            this.setState({
                error: null,
                gettingMessage: true,
            });
            try {
                let messageBody = await (new IMAP.Worker()).getMessageBody(inMessage.id, this.state.currentMailbox);
                this.setState({
                    currentView: `message`,
                    gettingMessage: false,
                    messageBody: messageBody,
                    messageDate: inMessage.date,
                    messageFrom: inMessage.from,
                    messageID: inMessage.id,
                    messageSubject: inMessage.subject,
                    messageTo: null,
                });
            } catch (inError) {
                this.setState({
                    error: `Error getting message`,
                    gettingMessage: false,
                });
            }
        }.bind(inParentComponent),
    };
};

export default createMailboxesState;
