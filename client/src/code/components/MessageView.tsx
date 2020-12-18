import React from "react";
import {Button, InputBase, TextField} from "@material-ui/core";

const MessageView = ({state}) => (
    <form>
        <InputBase
            defaultValue={`ID ${state.messageID}`}
            className="messageInfoField"
            margin="dense"
            disabled={true}
            fullWidth={true}
        />
        <br/>
        <InputBase
            defaultValue={state.messageDate}
            className="messageInfoField"
            margin="dense"
            disabled={true}
            fullWidth={true}
        />
        <br/>
        <TextField
            value={state.messageFrom}
            label="From"
            margin="dense"
            variant="outlined"
            disabled={true}
            fullWidth={true}
            InputProps={{style: {color: "#000000"}}}
        />
        <br/>
        <TextField
            id="messageSubject"
            value={state.messageSubject}
            label="Subject"
            margin="dense"
            variant="outlined"
            fullWidth={true}
            disabled={true}
            InputProps={{style: {color: "#000000"}}}
        />
        <br/>
        <div dangerouslySetInnerHTML={{__html: state.messageBody}}/>
        <br/>
        <Button
            variant="contained"
            color="primary"
            size="small"
            style={{marginTop: 10, marginRight: 10}}
            onClick={() => state.showComposeMessage(`reply`)}
        >
            Reply
        </Button>
        <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{marginTop: 10, marginRight: 10}}
            onClick={state.deleteMessage}
        >
            Delete
        </Button>
    </form>
);

export default MessageView;
