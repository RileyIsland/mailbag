import React, {Component} from "react";
import {Dialog, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import ContactForm from "./ContactForm";
import ContactList from "./ContactList";
import MailboxList from "./MailboxList";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import Toolbar from "./Toolbar";
import {createState} from "../state/baseState";
import MessageView from "./MessageView";
import {Alert, AlertTitle} from "@material-ui/lab";

class BaseLayout extends Component {
    state = createState(this);

    render() {
        return (
            <div className="appContainer">
                <Dialog
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    open={this.state.isPleaseWaitVisible()}
                    transitionDuration={0}
                >
                    <DialogTitle style={{textAlign: `center`}}>Please Wait</DialogTitle>
                    <DialogContent><DialogContentText>...Contacting server...</DialogContentText></DialogContent>
                </Dialog>
                <div className="toolbar"><Toolbar state={this.state}/></div>
                <div className="mailboxList"><MailboxList state={this.state}/></div>
                <div className="centerArea">
                    <div className={
                        `messageList` + (this.state.currentView === `welcome` && !this.state.error ? ` expanded` : ``)
                    }>
                        <MessageList state={this.state}/>
                    </div>
                    {
                        this.state.currentView !== `welcome` &&
                        <div className="centerViews">
                            {
                                this.state.error &&
                                <Alert
                                    onClose={() => {
                                        this.setState({error: null});
                                    }}
                                    severity="error"
                                    style={{
                                        marginBottom: 10
                                    }}
                                >
                                    <AlertTitle style={{textAlign: `center`}}>Error</AlertTitle>
                                    {this.state.error}
                                </Alert>
                            }
                            {this.state.currentView === "compose" && <MessageForm state={this.state}/>}
                            {this.state.currentView === "contact" && <ContactForm state={this.state}/>}
                            {this.state.currentView === "message" && <MessageView state={this.state}/>}
                        </div>
                    }
                </div>
                <div className="contactList"><ContactList state={this.state}/></div>
            </div>
        );
    }

}

export default BaseLayout;
