import React from "react";
import {Chip, List} from "@material-ui/core";
import {IMailbox} from "../IMAP";

const MailboxList = ({state}) => (
    <List>
        {state.mailboxes.map((value: IMailbox) => {
            return (
                <Chip
                    label={`${value.name}`}
                    onClick={() => state.getMessages(value.path)}
                    style={{width: 128, marginBottom: 10}}
                    color={state.currentMailbox === value.path ? `secondary` : `primary`}
                />
            );
        })}
    </List>
);

export default MailboxList;
