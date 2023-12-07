"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Node path import
const path_1 = __importDefault(require("path"));
//Express import
const express_1 = __importDefault(require("express"));
//app import
const ServerInfo_1 = require("./ServerInfo");
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMAP"));
const Contacts = __importStar(require("./contacts"));
const app = (0, express_1.default)(); //create app
// set JSON in request bodies.
app.use(express_1.default.json());
// Serve the client to a requested browser.
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
//set header,including domain,methods, additional header
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header('Access-Control-Allow-Origin', '*');
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
class Result {
    constructor(code, state, ans) {
        this.codeNumber = code;
        this.status = state;
        this.data = ans;
    }
    ;
}
//get mailboxes
app.get("/mailboxes", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET/mailboxes");
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const mailboxes = yield imapWorker.listMailboxes();
        const res = new Result(200, "success", mailboxes);
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//get all messages from a specific mailbox
app.get("/mailboxes/:mailbox", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET/mailbox", inRequest.params.mailbox);
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messages = yield imapWorker.listMessages({
            mailbox: inRequest.params.mailbox //get the param after /mailboxes
        });
        const res = new Result(200, "success", messages);
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res); //transfer mailboxes ot json
    }
}));
//get a message
app.get("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET/messages()", inRequest.params.mailbox, inRequest.params.id);
    try {
        const imapWorkder = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messageBody = yield imapWorkder.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10) //the id
        });
        inResponse.status(200); //success
        inResponse.send(messageBody);
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//delete a message 
app.delete("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DELETE/messages", inRequest.params.mailbox, inRequest.params.id);
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        const res = new Result(200, "success", "ok");
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//send/add a message
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST/messages", inRequest.body);
    try {
        const smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
        yield smtpWorker.sendMessage(inRequest.body);
        const res = new Result(200, "success", "ok");
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//get contacts
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET/contacts");
    try {
        const contactWorkder = new Contacts.Worker();
        const contacts = yield contactWorkder.listContacts();
        const res = new Result(200, "success", contacts);
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//add contact
app.post("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST/contacts", inRequest.body);
    try {
        const contactWorkder = new Contacts.Worker();
        const contact = yield contactWorkder.addContact(inRequest.body);
        const res = new Result(201, "success", contact);
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
// Update Contacts(inresponse body involves id)
app.put("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("PUT/ contacts", inRequest.body);
    try {
        const contactWorker = new Contacts.Worker();
        const contact = yield contactWorker.updateContact(inRequest.body);
        const res = new Result(200, "success", contact);
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
//delete contact
app.delete("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("DELETE /contacts", inRequest.body);
    try {
        const contactWorkder = new Contacts.Worker();
        yield contactWorkder.deleteContact(inRequest.params.id);
        const res = new Result(200, "success", "ok");
        inResponse.json(res); //transfer mailboxes ot json
    }
    catch (inError) {
        const res = new Result(400, "error", null);
        inResponse.json(res);
    }
}));
app.listen(80, () => {
    console.log("MailBag server is starting!");
});
//# sourceMappingURL=main.js.map