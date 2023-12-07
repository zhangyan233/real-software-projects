"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const ImapClient = require("emailjs-imap-client");
const mailparser_1 = require("mailparser");
//This is (most likely) necessary to make the calls to the IMAP server work to ignore the safety of certification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//perform IMAP operations
class Worker {
    constructor(inServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    //connect the mailbox; return: IMapClient
    connectToServer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("connect to server...");
            const client = new ImapClient.default(Worker.serverInfo.imap.host, Worker.serverInfo.imap.port, {
                auth: Worker.serverInfo.imap.auth //including username and password
            });
            client.logLevel = client.LOG_LEVEL_NONE; //output log
            client.onerror = (inError) => {
                console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
            };
            yield client.connect();
            console.log("IMAP.Worker.listMailboxes():connected");
            return client;
        });
    }
    //list mailboxes; return an array of mailbox
    listMailboxes() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.listMailboxes()");
            const client = yield this.connectToServer();
            const mailboxes = yield client.listMailboxes();
            yield client.close();
            //transfer from emailjs-imap-client objects to result
            //traverse every level of result, and get every mailboxes
            const finalMailboxes = [];
            const iterateChildren = (inArray) => {
                inArray.forEach((inValue) => {
                    finalMailboxes.push({
                        name: inValue.name,
                        path: inValue.path
                    });
                    iterateChildren(inValue.children);
                });
            };
            iterateChildren(mailboxes.children);
            return finalMailboxes;
        });
    }
    //list messages;return an array of message
    listMessages(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.listMessages()", inCallOptions);
            const client = yield this.connectToServer();
            //select one mailbox
            const mailbox = yield client.selectMailbox(inCallOptions.mailbox);
            //if the mailbox doesn't exist, return an empty array
            if (mailbox.exists === 0) {
                yield client.close();
                return [];
            }
            const messages = yield client.listMessages(inCallOptions.mailbox, //the name of mailbox
            "1:*", //begin with the first position
            ["uid", "envelope"] //unique id; the data of envelope
            );
            yield client.close();
            //transfer emailjs-imap-client objects
            const finalMessages = [];
            //get every message from messages to IMessage[]
            messages.forEach((inValue) => {
                finalMessages.push({
                    id: inValue.uid,
                    date: inValue.envelope.date,
                    from: inValue.envelope.from[0].address,
                    subject: inValue.envelope.subject
                });
            });
            return finalMessages;
        });
    }
    //get messageBody from a single message; return plain text of message
    getMessageBody(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.getMessageBody()", inCallOptions);
            const client = yield this.connectToServer();
            const messages = yield client.listMessages(inCallOptions.mailbox, inCallOptions.id, //message id
            ["body[]"], //an array of body
            { byUid: true } //listing messages based on a Uid
            );
            //transfer messages to ParseMail Objecg
            const parsed = yield (0, mailparser_1.simpleParser)(messages[0]["body[]"]);
            yield client.close();
            return parsed.text;
        });
    }
    //delete message
    deleteMessage(inCallOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("IMAP.Worker.deleteMessage()", inCallOptions);
            const client = yield this.connectToServer();
            yield client.deleteMessages(inCallOptions.mailbox, inCallOptions.id, //specific message ID
            { byUid: true });
            yield client.close();
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=IMAP.js.map