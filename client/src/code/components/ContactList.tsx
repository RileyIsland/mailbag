import React from "react";
import {Avatar, List, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {Person} from "@material-ui/icons";
import {IContact} from "../Contacts";

const ContactList = ({state}) => (
    <List>
        {state.contacts.map((contact: IContact) => {
            return (
                <ListItem
                    button
                    key={contact._id}
                    onClick={() => state.showContact(contact)}
                >
                    <ListItemAvatar>
                        <Avatar>
                            <Person/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${contact.name}`}/>
                </ListItem>
            );
        })}
    </List>
);

export default ContactList;
