//import lib
import { ParsedMail } from "mailparser";
const ImapClient=require("emailjs-imap-client");
import { simpleParser } from "mailparser";

//import app
import { IServerInfo } from "./ServerInfo";

//describe a mailbox: mailbox:name  id(optional):messageId
export interface ICallOptions{
    mailbox:string,
    id?:number
}

//describe a message,
//when listing message, the body isn't sent, so the body is optional
export interface IMessage{
    id:string,
    date:string,
    from:string,
    subject:string,
    body?:string
}

//describe a mailbox
export interface IMailbox{
    name:string,
    path:string //identify a mailbox
}

//This is (most likely) necessary to make the calls to the IMAP server work to ignore the safety of certification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//perform IMAP operations
export class Worker{
    private static serverInfo:IServerInfo;

    constructor(inServerInfo:IServerInfo){
        Worker.serverInfo=inServerInfo;
    }

    //connect the mailbox; return: IMapClient
    private async connectToServer():Promise<any>{
        console.log("connect to server...");
        
        const client:any=new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            {
                auth:Worker.serverInfo.imap.auth//including username and password
            }
        );
        client.logLevel = client.LOG_LEVEL_NONE;//output log
        client.onerror=(inError:Error)=>{
            console.log(
                "IMAP.Worker.listMailboxes(): Connection error",inError
            );
        };
        await client.connect();
        console.log("IMAP.Worker.listMailboxes():connected")
        return client;

    }

    //list mailboxes; return an array of mailbox
    public async listMailboxes():
        Promise<IMailbox[]> {
            console.log("IMAP.Worker.listMailboxes()");
            const client: any = await this.connectToServer();
            const mailboxes: any = await client.listMailboxes();
            await client.close();

            //transfer from emailjs-imap-client objects to result
            //traverse every level of result, and get every mailboxes
            const finalMailboxes: IMailbox[] = [];
            const iterateChildren: Function =
            (inArray: any[]): void => {
                inArray.forEach((inValue: any) => {
                    finalMailboxes.push({
                        name : inValue.name, 
                        path : inValue.path
                    });
                    iterateChildren(inValue.children);
                });
            };
            iterateChildren(mailboxes.children);
            return finalMailboxes;
        }

    //list messages;return an array of message
    public async listMessages(inCallOptions: ICallOptions):
        Promise<IMessage[]> {

            console.log("IMAP.Worker.listMessages()", inCallOptions);
            const client: any = await this.connectToServer();
            //select one mailbox
            const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
            
            //if the mailbox doesn't exist, return an empty array
            if (mailbox.exists === 0) {
                await client.close();
                return [];
            }

            const messages: any[] = await client.listMessages(
            inCallOptions.mailbox,//the name of mailbox
             "1:*", //begin with the first position
             [ "uid", "envelope" ]//unique id; the data of envelope
            );
            await client.close();

            //transfer emailjs-imap-client objects
            const finalMessages: IMessage[] = [];

            //get every message from messages to IMessage[]
            messages.forEach((inValue: any) => {
            finalMessages.push({
                id : inValue.uid, 
                date: inValue.envelope.date,
                from: inValue.envelope.from[0].address,
                subject: inValue.envelope.subject
                });
            });
            return finalMessages;
        }

    //get messageBody from a single message; return plain text of message
    public async getMessageBody(inCallOptions: ICallOptions):
        Promise<string|any> {
            console.log("IMAP.Worker.getMessageBody()", inCallOptions);
            const client: any = await this.connectToServer();
            const messages: any[] = await client.listMessages(
                inCallOptions.mailbox, 
                inCallOptions.id,//message id
                [ "body[]" ], //an array of body
                { byUid : true }//listing messages based on a Uid
            );

            //transfer messages to ParseMail Objecg
            const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);
            await client.close();
            return parsed.text;
        }
    
    //delete message
    public async deleteMessage(inCallOptions: ICallOptions):
        Promise<any> {
        console.log("IMAP.Worker.deleteMessage()", inCallOptions);
        const client: any = await this.connectToServer();

        await client.deleteMessages(
            inCallOptions.mailbox, 
            inCallOptions.id, //specific message ID
            { byUid : true }
        );
        await client.close();
    }
}