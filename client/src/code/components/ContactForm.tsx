import React from "react";
import {Button, TextField} from "@material-ui/core";

const ContactForm = ({state}) => (
    <form>
        <TextField
            id="contactName"
            value={state.contactName}
            label="Name"
            margin="dense"
            variant="outlined"
            InputProps={{style: {color: "#000000"}}}
            style={{width: 260}}
            onChange={state.handleFieldChange}
        />
        <br/>
        <TextField
            id="contactEmail"
            value={state.contactEmail}
            label="Email"
            margin="dense"
            variant="outlined"
            InputProps={{style: {color: "#000000"}}}
            style={{width: 520}}
            onChange={state.handleFieldChange}
        />
        <br/>
        <Button
            variant="contained"
            color="primary"
            size="small"
            style={{marginTop: 10, marginRight: 10}}
            onClick={state.saveContact}
        >
            Save
        </Button>
        {
            state.contactID !== null &&
            <Button
                variant="contained"
                color="secondary"
                size="small"
                style={{marginTop: 10, marginRight: 10}}
                onClick={() => {
                    confirm(`Are you sure you want to delete this contact?`) && state.deleteContact()
                }}
            >
                Delete
            </Button>
        }
        {
            state.contactID !== null &&
            <Button
                variant="contained"
                size="small"
                style={{marginTop: 10, marginRight: 10}}
                onClick={() => state.showComposeMessage(`contact`)}
            >
                Send Email
            </Button>
        }
    </form>
);

export default ContactForm;
