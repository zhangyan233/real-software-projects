//import axios
import axios from "axios";

//import config
import {config} from "./config";

export class Worker{
    //send message 
    //inTo: the emailAddress the email send to 
    //from: the eamilAddress the email from
    public async sendMessage(inTo: string, inFrom: string, inSubject: string,inMessage: string): Promise<void> {
        await axios.post(`${config.serverAddress}/messages`, {
        to : inTo, 
        from : inFrom, 
        subject : inSubject,
        text : inMessage
        });
    }
}
