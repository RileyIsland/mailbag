import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import {IServerInfo} from "./ServerInfo";

export class Worker {
    private serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        this.serverInfo = inServerInfo;
    }

    public sendMessage(inOptions: nodemailer.SendMailOptions): Promise<void> {
        return new Promise((inResolve, inReject) => {
            const transport: Mail = nodemailer.createTransport(this.serverInfo.smtp);
            transport.sendMail(
                inOptions,
                (inError: Error | null) => {
                    if (inError) {
                        console.error(`SMTP.Worker.sendMessage(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            )
        });
    }
}
