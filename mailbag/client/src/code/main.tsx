//import .css
import "normalize.css";//normalize.css is a CSS reset
import "../css/main.css";

// imports.React
import React from "react";
import ReactDOM  from "react-dom";

// imports App 
import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";


// Render the UI.
const baseComponent:any = ReactDOM.render(<BaseLayout />, document.body);
baseComponent.state.showHidePleaseWait(true);


//in the initial webpage, we can get mailboxes and contacts.
  async function getMailboxes() {
    const imapWorker: IMAP.Worker = new IMAP.Worker();
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
    mailboxes.forEach((inMailbox) => {
      baseComponent.state.addMailboxToList(inMailbox);
    });
  }
  // getMailboxes() is marked async, so now we need to call it:
  getMailboxes().then(function() {
    async function getContacts() {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
      contacts.forEach((inContact) => {
      baseComponent.state.addContactToList(inContact);
      });
    }
        getContacts().then(() =>
        baseComponent.state.showHidePleaseWait(false));//hide 
  });

