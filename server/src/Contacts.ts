import * as path from "path";

const Datastore = require("nedb");

export interface IContact {
    _id?: number,
    name: string,
    email: string
}

export class Worker {
    private db: Nedb;

    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, `contacts.db`),
            autoload: true
        });
    }

    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.insert(
                inContact,
                (inError: Error | null, inNewDoc: IContact) => {
                    if (inError) {
                        console.error(`Contacts.Worker.addContact(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve(inNewDoc);
                    }
                }
            );
        });
    }

    public deleteContact(inID: string): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.remove(
                {
                    _id: inID
                },
                {},
                (inError: Error | null) => {
                    if (inError) {
                        console.error(`Contacts.Worker.deleteContact(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    }

    public getContact(inID: string): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.findOne(
                {
                    _id: inID
                },
                {},
                (inError: Error | null, inContact: IContact) => {
                    if (inError) {
                        console.error(`Contacts.Worker.getContact(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve(inContact);
                    }
                }
            );
        });
    }

    public getContactByEmail(inEmail: string): Promise<IContact | null> {
        return new Promise((inResolve, inReject) => {
            this.db.findOne(
                {
                    email: inEmail
                },
                {},
                (inError: Error | null, inContact: IContact) => {
                    if (inError) {
                        console.error(`Contacts.Worker.getContactByEmail(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve(inContact);
                    }
                }
            );
        });
    }

    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find(
                {},
                (inError: Error | null, inDocs: IContact[]) => {
                    if (inError) {
                        console.error(`Contacts.Worker.listContacts(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve(inDocs);
                    }
                }
            );
        });
    }

    public updateContact(inID: string, inContact: IContact): Promise<void> {
        return new Promise((inResolve, inReject) => {
            this.db.update(
                {
                    _id: inID
                },
                inContact,
                {},
                (inError: Error | null) => {
                    if (inError) {
                        console.error(`Contacts.Worker.updateContact(): Error`, inError);
                        inReject(inError);
                    } else {
                        inResolve();
                    }
                }
            );
        });
    }
}
