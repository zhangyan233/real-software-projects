// imports React 
import React, { Component } from "react";

//import lib
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// import app 
import Toolbar from "./Toolbar";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import ContactList from "./ContactList";
import WelcomeView from "./WelcomeView";
import ContactView from "./ContactView";
import MessageView from "./MessageView";
import { createState } from "../state";

class BaseLayout extends Component{

    state=createState(this);

    //render
    render():JSX.Element{
        return (
            <div className="appContainer"> 
                <Dialog open={ this.state.pleaseWaitVisible }
                //prevent user to close by mouse or esc
                    disableEscapeKeyDown={ true }
                    transitionDuration={ 0 }
                    onClose={(inEvent: any,inReason: any)=>{
                        if(inReason!="backdropClick"){
                            this.state.showHidePleaseWait(false);
                        }
                        
                    }}
   
                >
                    <DialogTitle style={{ textAlign:"center" }}>Please Wait</DialogTitle>
                    <DialogContent><DialogContentText>
                        ...Contacting server...
                     </DialogContentText></DialogContent>
                </Dialog>

                <div className="toolbar">
                <Toolbar state={ this.state } />
                </div>

                <div className="mailboxList">
                <MailboxList state={ this.state } />
                </div>

                <div className="centerArea">
                    <div className="messageList">
                        <MessageList state={ this.state } />
                    </div>

                    <div className="centerViews">
                        { this.state.currentView === "welcome" && <WelcomeView /> }
                        { (this.state.currentView === "message" ||this.state.currentView === "compose") &&
                        <MessageView state={ this.state } />}
                        { (this.state.currentView === "contact" ||
                        this.state.currentView === "contactAdd") &&<ContactView state={ this.state } />}
                    </div>
                </div>

                <div className="contactList">
                    <ContactList state={ this.state } />
                </div>
            </div>
        )
    }
}

export default BaseLayout;