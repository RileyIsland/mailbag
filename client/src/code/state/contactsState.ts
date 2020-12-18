import {Component} from "react";
import * as Contacts from "../Contacts";
import {IContact} from "../Contacts";

let createContactsState = (inParentComponent: Component) => {
    return {
        deletingContact: false,
        gettingContacts: false,
        savingContact: false,
        contactID: null,
        contactName: null,
        contactEmail: null,
        contacts: [],

        addContact: function (inContact: Contacts.IContact): void {
            const contacts: Contacts.IContact[] = this.state.contacts.slice(0);
            contacts.push(inContact);
            this.setState({
                contacts: contacts,
            });
        }.bind(inParentComponent),

        deleteContact: async function (): Promise<void> {
            this.setState({
                deletingContact: true,
                error: null,
            });
            try {
                const contactsWorker: Contacts.Worker = new Contacts.Worker();
                await contactsWorker.deleteContact(this.state.contactID);
                await this.state.getContacts();
                this.setState({
                    contactEmail: null,
                    contactID: null,
                    contactName: null,
                    currentView: `welcome`,
                    deletingContact: false,
                });
            } catch (inError) {
                this.setState({
                    deletingContact: false,
                    error: `Error deleting contact`,
                });
            }
        }.bind(inParentComponent),

        getContacts: async function (): Promise<void> {
            this.setState({
                error: null,
                gettingContacts: true,
                contacts: [],
            });
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            try {
                const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
                contacts.forEach((inContact) => {
                    this.state.addContact(inContact);
                });
                this.setState({
                    gettingContacts: false,
                });
            } catch (inError) {
                this.setState({
                    error: `Error getting contacts`,
                    gettingContacts: false,
                })
            }
        }.bind(inParentComponent),

        saveContact: async function (): Promise<void> {
            this.setState({
                error: null,
                savingContact: true,
            });
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            let contact: Contacts.IContact | string;
            try {
                if (this.state.contactID) {
                    contact = {
                        _id: this.state.contactID,
                        email: this.state.contactEmail,
                        name: this.state.contactName,
                    };
                    await contactsWorker.updateContact(contact);
                    await this.state.getContacts();
                } else {
                    contact = await contactsWorker.addContact({
                        email: this.state.contactEmail,
                        name: this.state.contactName,
                    });
                    this.state.addContact(contact);
                }
                this.setState({
                    contactEmail: null,
                    contactID: null,
                    contactName: null,
                    currentView: `welcome`,
                    savingContact: false,
                });
            } catch (inError) {
                this.setState({
                    error: `Error saving contact`,
                    savingContact: false,
                });
            }
        }.bind(inParentComponent),

        showAddContact: function (): void {
            this.setState({
                contactEmail: ``,
                contactID: null,
                contactName: ``,
                currentView: `contact`,
                error: null,
            });
        }.bind(inParentComponent),

        showContact: function (inContact?: IContact): void {
            this.setState({
                contactEmail: inContact && inContact.email || null,
                contactID: inContact && inContact._id || null,
                contactName: inContact && inContact.name || null,
                currentView: `contact`,
                error: null,
            });
        }.bind(inParentComponent),
    };
};

export default createContactsState;
