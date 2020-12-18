import React from "react";
import {Button, InputBase, TextField} from "@material-ui/core";

const MessageForm = ({state}) => (
    <form>
        <TextField
            id="messageTo"
            value={state.messageTo}
            label="To"
            margin="dense"
            variant="outlined"
            fullWidth={true}
            InputProps={{style: {color: "#000000"}}}
            onChange={state.handleFieldChange}
        />
        <br/>
        <TextField
            id="messageSubject"
            value={state.messageSubject}
            label="Subject"
            margin="dense"
            variant="outlined"
            fullWidth={true}
            InputProps={{style: {color: "#000000"}}}
            onChange={state.handleFieldChange}
        />
        <br/>
        <TextField
            id="messageBody"
            value={state.messageBody}
            margin="dense"
            variant="outlined"
            fullWidth={true}
            multiline={true}
            rows={12}
            InputProps={{style: {color: "#000000"}}}
            onChange={state.handleFieldChange}
        />
        <br/>
        <Button
            variant="contained"
            color="primary"
            size="small"
            style={{marginTop: 10, marginRight: 10}}
            onClick={state.sendMessage}
        >
            Send
        </Button>
    </form>
);

export default MessageForm;
