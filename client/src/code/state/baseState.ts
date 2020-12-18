import {Component} from "react";
import createContactsState from "./contactsState";
import createMailboxesState from "./mailboxesState";

export function createState(inParentComponent: Component) {
    return {
        currentView: `welcome`,
        error: null,
        ...createContactsState(inParentComponent),
        ...createMailboxesState(inParentComponent),

        isPleaseWaitVisible: function (): boolean {
            return this.deletingContact ||
                this.deletingMessage ||
                this.gettingContacts ||
                this.gettingMailboxes ||
                this.gettingMessage ||
                this.gettingMessages ||
                this.savingContact ||
                this.sendingMessage;
        },

        handleFieldChange: function (inEvent: any): void {
            this.setState({
                error: null,
            })
            if (inEvent.target.id === `contactName` && inEvent.target.value.length > 16) {
                return;
            }
            this.setState({
                [inEvent.target.id]: inEvent.target.value,
            });
        }.bind(inParentComponent),
    }
}
