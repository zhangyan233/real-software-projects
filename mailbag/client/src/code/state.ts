//import react
import React from "react";

// App imports.
import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";


//call from baselayout
export function createState(inParentComponent:any):any {

  
    return{


      // boolean: Is the "please wait" dialog visible?
      pleaseWaitVisible: false,
  
      // List of contacts.
      contacts: [],
  
      // List of mailboxes.
      mailboxes: [],
  
      // List of messages in the current mailbox.
      messages: [],
  
      //starts out with the "welcome" view and then changes to one of "welcome",
      currentView: "welcome",
  
      // The currently selected mailbox, if any.
      currentMailbox: null,
  
      // The details of the message currently being viewed or composed, if any.
      messageID: null,
      messageDate: null,
      messageFrom: null,
      messageTo: null,
      messageSubject: null,
      messageBody: null,
  
      // The details of the contact currently being viewed or added, if any.
      contactID: null,
      contactName: null,
      contactEmail: null,
  
      // ----------------------------view switch---------------------- 
  
      //show or hide "please wait" during the server call
      showHidePleaseWait: function (inVisible: boolean): void {
  
        this.setState({ pleaseWaitVisible: inVisible });
  
      }.bind(inParentComponent), 
  
      //Show ContactView in view mode.
      //inID    The ID of the contact to show.
      //inName  The name of the contact to show.
      //inEmail The Email address of the contact to show.
      showContact: function (inID: string, inName: string, inEmail: string): void {
  
        this.setState({ currentView: "contact", contactID: inID, contactName: inName, contactEmail: inEmail });
  
      }.bind(inParentComponent), /* End showContact(). */
  
  
      // Show ContactView in add mode.the contact won’t have an ID until we save it to the server, so contactID is null
      showAddContact: function (): void {
  
        this.setState({ currentView: "contactAdd", contactID: null, contactName: "", contactEmail: "" });
  
      }.bind(inParentComponent), /* End showAddContact(). */
  
  
  
      //Show MessageView in view mode.
      showMessage: async function (inMessage: IMAP.IMessage): Promise<void> {
  
        // Get the message's body and display "please wait"
        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const mb: String = await imapWorker.getMessageBody(inMessage.id, this.state.currentMailbox);
        this.state.showHidePleaseWait(false);
  
        // Update state.
        this.setState({
          currentView: "message",
          messageID: inMessage.id, messageDate: inMessage.date, messageFrom: inMessage.from,
          messageTo: "", messageSubject: inMessage.subject, messageBody: mb
        });
  
      }.bind(inParentComponent), /* End showMessage(). */
  
  
      //  Show MessageView in compose mode.
      //  inType Pass "new" if this is a new message, "reply" if it's a reply to the message currently being viewed, and "contact" if it's a message to the contact currently being viewed.
      showComposeMessage: function (inType: string): void {
  
        switch (inType) {
  
          // user wants to compose a brand-new message
          // clear out the messageTo, messageSubject, messageBody fields.
          case "new":
            this.setState({
              currentView: "compose",
              messageTo: "", messageSubject: "", messageBody: "",
              messageFrom: config.userEmail
            });
            break;
  
          // ultimately the "compose" view 
          // pre-fill the messageTo, messageSubject, and messageBody variables in state.
          case "reply":
            this.setState({
              currentView: "compose",
              messageTo: this.state.messageFrom, messageSubject: `Re: ${this.state.messageSubject}`,
              messageBody: `\n\n---- Original Message ----\n\n${this.state.messageBody}`, messageFrom: config.userEmail
            });
            break;
  
          // the user clicks the Send Email button when viewing a contact
          // messageTo comes from the contact while messageSubject and messageBody are blanked out.
          case "contact":
            this.setState({
              currentView: "compose",
              messageTo: this.state.contactEmail, messageSubject: "", messageBody: "",
              messageFrom: config.userEmail
            });
            break;
  
        }
  
      }.bind(inParentComponent), 
  
      //------------------------------list---------------------------
  
  
    
      //Add a mailbox to the list of mailboxes.
      addMailboxToList: function (inMailbox: IMAP.IMailbox): void {
        // Copy list.
        const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
  
        // push the new mailbox into that copy,
        cl.push(inMailbox);
  
        // Update list in state.
        this.setState({ mailboxes: cl });
  
      }.bind(inParentComponent), /* End addMailboxToList(). */
  
  
       //Add a contact to the list of contacts.
      addContactToList: function (inContact: Contacts.IContact): void {
        // Copy list.
        const cl = this.state.contacts.slice(0);
  
        // Add new element explicitly
        cl.push({ _id: inContact._id, name: inContact.name, email: inContact.email });
  
        // Update list in state.
        this.setState({ contacts: cl });
  
      }.bind(inParentComponent), /* End addContactToList(). */
  
  
      //Add a message to the list of messages in the current mailbox.
      addMessageToList: function (inMessage: IMAP.IMessage): void {
        // Copy list.
        const cl = this.state.messages.slice(0);
  
        // Add new element.
        cl.push({ id: inMessage.id, date: inMessage.date, from: inMessage.from, subject: inMessage.subject });
  
        // Update list in state.
        this.setState({ messages: cl });
  
      }.bind(inParentComponent), /* End addMessageToList(). */
  
  
      //Clear the list of messages currently displayed.
      clearMessages: function (): void {
        this.setState({ messages: [] });
  
      }.bind(inParentComponent), /* End clearMessages(). */
  
  
      // ------------------------------------ Handler -----------------------------------
  
  
  
      //Set the current mailbox.
      //inPath The path of the current mailbox
      setCurrentMailbox: function (inPath: String): void {
        // Update state.
        // because until the user selects a message, there’s nothing to show in the view area which defaulted to the welcome view.
        this.setState({ currentView: "welcome", currentMailbox: inPath });
  
        // Now go get the list of messages for the mailbox.
        this.state.getMessages(inPath);
  
      }.bind(inParentComponent), /* End setCurrentMailbox(). */
  
  
      // Get a list of messages in the currently selected mailbox, if any.
      // inPath The path to the mailbox to get messages for. 
      // the reason why use async, when call the method,we can't know the state has been updated
      getMessages: async function (inPath: string): Promise<void> {
        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
        this.state.showHidePleaseWait(false);
  
        this.state.clearMessages(); // clear any current list of messages
        messages.forEach((inMessage: IMAP.IMessage) => {
          this.state.addMessageToList(inMessage);
        });
  
      }.bind(inParentComponent), /* End getMessages(). */
  
  
      // Fires any time the user types in an editable field.
      // inEvent The event object generated by the keypress.
      fieldChangeHandler: function (inEvent: any): void {
        //make contactName maxLength is 16
        if (inEvent.target.id === "contactName" && inEvent.target.value.length > 16) { return; }
  
        this.setState({ [inEvent.target.id]: inEvent.target.value });
  
      }.bind(inParentComponent), /* End fieldChangeHandler(). */
  
  
      //  Save contact.
      saveContact: async function (): Promise<void> {
        // Copy list.
        const cl = this.state.contacts.slice(0);
  
        // Save to server.
        this.state.showHidePleaseWait(true);
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: Contacts.IContact =
          await contactsWorker.addContact({ name: this.state.contactName, email: this.state.contactEmail });
        this.state.showHidePleaseWait(false);
  
        // Add to list.
        cl.push(contact);
  
        // Update state.
        this.setState({ contacts: cl, contactID: null, contactName: "", contactEmail: "" });
  
      }.bind(inParentComponent), /* End saveContact(). */
  

  
      //  Delete the currently viewed contact.
      deleteContact: async function (): Promise<void> {
  
        // Delete from server.
        this.state.showHidePleaseWait(true);
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(this.state.contactID);
        this.state.showHidePleaseWait(false);
  
        // Remove from list.
        const cl = this.state.contacts.filter((inElement:Contacts.IContact) => inElement._id != this.state.contactID);
  
        // Update state.
        this.setState({ contacts: cl, contactID: null, contactName: "", contactEmail: "" });
  
      }.bind(inParentComponent), /* End deleteContact(). */

      
  
      //  update the currently viewed contact.
      updateContact: async function (this: any): Promise<void> {
  
        // update at server.
        this.state.showHidePleaseWait(true);
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: Contacts.IContact =
          await contactsWorker.updateContact({ _id: this.state.contactID, name: this.state.contactName, email: this.state.contactEmail });
        this.state.showHidePleaseWait(false);
  
        // Remove from list.
        const cl = this.state.contacts.slice(0);
        const new_cl = cl.filter((inElement:Contacts.IContact) => inElement._id != this.state.contactID);
        new_cl.push(contact);
  
        // Update state.
        this.setState({ contacts: new_cl, contactID: contact._id, contactName: contact.name, contactEmail: contact.email });
  
      }.bind(inParentComponent), /* End updateContact(). */
  
      //  Delete the currently viewed message.
      deleteMessage: async function (): Promise<void> {
  
        // Delete from server.
        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        await imapWorker.deleteMessage(this.state.messageID, this.state.currentMailbox);
        this.state.showHidePleaseWait(false);
  
        // Remove from list.
        const cl = this.state.messages.filter((inElement:IMAP.IMessage) => inElement.id != this.state.messageID);
  
        // Update state.
        this.setState({ messages: cl, currentView: "welcome" });
  
      }.bind(inParentComponent), /* End deleteMessage(). */
  
  
      
      //  send a message (from the server and the contact list).
      sendMessage: async function (): Promise<void> {
  
        // Send the message.
        this.state.showHidePleaseWait(true);
        const smtpWorker: SMTP.Worker = new SMTP.Worker();
        await smtpWorker.sendMessage(this.state.messageTo, this.state.messageFrom, this.state.messageSubject,
          this.state.messageBody
        );
        this.state.showHidePleaseWait(false);
  
        // Update state.
        this.setState({ currentView: "welcome" });
  
      }.bind(inParentComponent) /* End sendMessage(). */
    };
  }


