//import lib
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions,SentMessageInfo } from "nodemailer";

//import app
import { IServerInfo } from "./ServerInfo";

//export Worker to perform SMTP
export class Worker{
    private static serverInfo:IServerInfo;

    constructor(inServerInfo:IServerInfo){
        Worker.serverInfo=inServerInfo;
    }

    //inOptions Object including: to, from, subject and text
    //return: string(success:null; error: error message)
    public sendMessage(inOptions:SendMailOptions):
    Promise<string>{
    
        console.log("SMTP.Worker.sendMessage()", inOptions);

        return new Promise((inResolve,inReject)=>{

            //use transport to send mail
            const transport:Mail=nodemailer.createTransport(Worker.serverInfo.smtp);
            console.log(Worker.serverInfo.smtp);

            transport.sendMail(
                inOptions,//message details from the client
                (inError:Error|null,inInfo:SentMessageInfo)=>{
                    if(inError){
                        inReject(inError);
                    }else{
                        inResolve("");
                    }
                }
            );
        });
    }

}



