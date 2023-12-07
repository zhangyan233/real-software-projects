//Node path import
import path from "path";
//Express import
import express,
 { Express, NextFunction, Request, Response } from "express";

 //app import
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMAP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";

const app:Express=express();//create app


// set JSON in request bodies.
app.use(express.json());

// Serve the client to a requested browser.
app.use("/",express.static(path.join(__dirname,"../../client/dist")))

//set header,including domain,methods, additional header
app.use(function(inRequest:Request,inResponse:Response,inNext:NextFunction){
    inResponse.header('Access-Control-Allow-Origin','*');
    inResponse.header("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});

interface IResult{
    codeNumber:number;
    status:string;
    data?:any;
}

class Result implements IResult{
    codeNumber:number;
    status:string;
    data?:any;

    constructor(code:number,state:string,ans:any){
        this.codeNumber=code;
        this.status=state;
        this.data=ans;
    };
}


//get mailboxes
app.get("/mailboxes",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("GET/mailboxes");
        try{
            const imapWorker:IMAP.Worker=new IMAP.Worker(serverInfo);
            const mailboxes:IMAP.IMailbox[]=await imapWorker.listMailboxes();

            const res=new Result(200,"success",mailboxes);
            inResponse.json(res); //transfer mailboxes ot json
        }catch(inError){
            const res=new Result(400,"error",null);
            inResponse.json(res);
        }
    });

//get all messages from a specific mailbox
app.get("/mailboxes/:mailbox",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("GET/mailbox", inRequest.params.mailbox);
        try{
            const imapWorker:IMAP.Worker=new IMAP.Worker(serverInfo);
            const messages:IMAP.IMessage[]=await imapWorker.listMessages({
                mailbox:inRequest.params.mailbox//get the param after /mailboxes
            });

            const res=new Result(200,"success",messages);
            inResponse.json(res); //transfer mailboxes ot json
           
        }catch(inError){
            
            const res=new Result(400,"error",null);
            inResponse.json(res); //transfer mailboxes ot json
        }
});

//get a message
app.get("/messages/:mailbox/:id",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("GET/messages()", inRequest.params.mailbox, inRequest.params.id);
        try{
            const imapWorkder:IMAP.Worker=new IMAP.Worker(serverInfo);
            const messageBody:string=await imapWorkder.getMessageBody({
                mailbox:inRequest.params.mailbox,//the name of mailbox
                id:parseInt(inRequest.params.id,10)//the id
            })
            
            inResponse.status(200);//success
            inResponse.send(messageBody);
        }catch(inError){
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
    }
);

//delete a message 
app.delete("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        console.log("DELETE/messages",inRequest.params.mailbox,inRequest.params.id)
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox : inRequest.params.mailbox,
                id : parseInt(inRequest.params.id, 10)
            });
            
            const res=new Result(200,"success","ok");
            inResponse.json(res); //transfer mailboxes ot json
        } catch (inError) {
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
    }
);

//send/add a message
app.post("/messages",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("POST/messages", inRequest.body);
        try{
            const smtpWorker:SMTP.Worker=new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
           
            const res=new Result(200,"success","ok");
            inResponse.json(res); //transfer mailboxes ot json
        }catch(inError){
            
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
    });

//get contacts
app.get("/contacts",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("GET/contacts");
        try{
            const contactWorkder:Contacts.Worker=new Contacts.Worker();
            const contacts:IContact[]=await contactWorkder.listContacts();
            
            const res=new Result(200,"success",contacts);
            inResponse.json(res); //transfer mailboxes ot json
        }catch(inError){
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
});

//add contact
app.post("/contacts",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("POST/contacts",inRequest.body);
        try{
            const contactWorkder:Contacts.Worker=new Contacts.Worker();
            const contact:IContact=await contactWorkder.addContact(inRequest.body);
            
            const res=new Result(201,"success",contact);
            inResponse.json(res); //transfer mailboxes ot json
        }catch(inError){
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
});

// Update Contacts(inresponse body involves id)
app.put("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        console.log("PUT/ contacts", inRequest.body);
        try {
            const contactWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactWorker.updateContact(inRequest.body);
            
            const res=new Result(200,"success",contact);
            inResponse.json(res); //transfer mailboxes ot json
        } catch (inError) {
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
    }
);

//delete contact
app.delete("/contacts/:id",
    async(inRequest:Request,inResponse:Response)=>{
        console.log("DELETE /contacts", inRequest.body);
        try{
            const contactWorkder:Contacts.Worker=new Contacts.Worker();
            await contactWorkder.deleteContact(inRequest.params.id);
            
            const res=new Result(200,"success","ok");
            inResponse.json(res); //transfer mailboxes ot json
        }catch(inError){
            const res=new Result(400,"error",null);
            inResponse.json(res); 
        }
});

app.listen(80,()=>{
    console.log("MailBag server is starting!")
})

