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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
//import Node
const path = __importStar(require("path"));
//import lib
const Datastore = require("nedb");
//perform Contact
class Worker {
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contact.db"),
            autoload: true
        });
    }
    //list contaccts; return an array of contacts
    listContacts() {
        console.log("Contacts.Worker.listContacts()");
        return new Promise((inResolve, inReject) => {
            this.db.find({}, (inError, inDocs) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    }
    //add contacts; return: eventally, promise resolves to IContact Object
    addContact(inContact) {
        console.log("Contacts.Worker.addContact()", inContact);
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact, (inError, inNewDoc) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inNewDoc);
                }
            });
        });
    }
    //delete contact,eventally, promise resolves to IContact Object
    deleteContact(inID) {
        console.log("Contacts.Worker.deleteContact()", inID);
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError, inNumRemoved) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve("");
                }
            });
        });
    }
    //modify contacts; return: eventally, promise resolves to IContact Object
    updateContact(inContact) {
        console.log("Contacts.Worker.updateContact()", inContact);
        return new Promise((inResolve, inReject) => {
            this.db.update({ _id: inContact._id }, { $set: inContact }, { returnUpdatedDocs: true }, //even update is not an upsert,will return the array of documents matched by the find query and updated
            (inError, numberOfUpdated, inDocs, upsert) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=contacts.js.map