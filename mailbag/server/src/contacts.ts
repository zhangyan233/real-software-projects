//import Node
import * as path from "path";

//import lib
const Datastore=require("nedb");

//describe a contact, add or retrieving don't need id, so it is optional
export interface IContact{
    _id?:number,
    name:string,
    email:string
}

//perform Contact
export class Worker{
    //set Nedb datastore 
    private db:Nedb;
    constructor(){
        this.db=new Datastore({
            filename:path.join(__dirname,"contact.db"),
            autoload:true
        });
    }

    //list contaccts; return an array of contacts
    public listContacts(): Promise<IContact[]> {
        console.log("Contacts.Worker.listContacts()");
        
        return new Promise((inResolve, inReject) => {
        this.db.find({ },
            (inError: Error, inDocs: IContact[]) => {
                if (inError) {    
                    inReject(inError);
                } else {
                    inResolve(inDocs);
                }
            }
        );
    });
    }

    //add contacts; return: eventally, promise resolves to IContact Object
    public addContact(inContact: IContact): Promise<IContact> {
        console.log("Contacts.Worker.addContact()", inContact);
        return new Promise((inResolve, inReject) => {
            this.db.insert(
                inContact,
                (inError:Error|null, inNewDoc:IContact)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(inNewDoc);
                    }
                });
        });
    }

    //delete contact,eventally, promise resolves to IContact Object
    public deleteContact(inID:string): Promise<string> {
        console.log("Contacts.Worker.deleteContact()", inID);
        return new Promise((inResolve, inReject) => {
        this.db.remove({ _id : inID }, { },
            (inError: Error|null, inNumRemoved: number) => {
            if (inError) {
                inReject(inError);
            } else {
                inResolve("");
            }
            }
        );
        });
    }

    //modify contacts; return: eventally, promise resolves to IContact Object
    public updateContact(inContact: IContact): Promise<IContact> {
        console.log("Contacts.Worker.updateContact()", inContact);
        return new Promise((inResolve, inReject) => {
            this.db.update(
                {_id:inContact._id},
                {$set:inContact},
                {returnUpdatedDocs:true},//even update is not an upsert,will return the array of documents matched by the find query and updated
                (inError:Error|null, numberOfUpdated:number,inDocs:IContact,upsert:boolean)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve(inDocs);
                    }
                });
        });
    }
}