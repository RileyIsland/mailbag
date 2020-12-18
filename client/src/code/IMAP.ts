import axios, {AxiosResponse} from "axios";
import {config} from "./config";

export interface IMailbox {
    name: string,
    path: string
}

export interface IMessage {
    body?: string
    date: string,
    from: string,
    id: string,
    subject: string,
}

export class Worker {
    public async deleteMessage(inID: string, inMailbox: string): Promise<void> {
        await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
    }

    public async getMessageBody(inID: string, inMailbox: string): Promise<string> {
        const response: AxiosResponse = await axios.get(
            `${config.serverAddress}/messages/${inMailbox}/${inID}`,
            {
                headers: {
                    Accept: `text/html`,
                },
            },
        );
        return response.data;
    }

    public async listMailboxes(): Promise<IMailbox[]> {
        const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes`);
        return response.data;
    }

    public async listMessages(inMailbox: string): Promise<IMessage[]> {
        const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes/${inMailbox}`);
        return response.data;
    }
}
