import React from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {IMessage} from "../IMAP";

const MessageList = ({state}) => (
    <Table stickyHeader padding="none">
        <TableHead>
            <TableRow>
                <TableCell style={{width: 120}}>Date</TableCell>
                <TableCell style={{width: 300}}>From</TableCell>
                <TableCell>Subject</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {state.messages.map((message: IMessage) => (
                <TableRow key={message.id} onClick={() => state.showMessage(message)}>
                    <TableCell>{new Date(message.date).toLocaleDateString()}</TableCell>
                    <TableCell>{message.from}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default MessageList;
