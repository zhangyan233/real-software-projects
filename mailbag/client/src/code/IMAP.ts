//import axois
import axios,{AxiosResponse} from "axios"

//import config
import {config} from "./config";

//describe mailbox
export interface IMailbox 
{ 
    name: string, 
    path: string 
}

//describe the message
export interface IMessage {
    id: string, 
    date: string, 
    from: string,
    subject: string,
    body?: string
}

export class Worker{

    //get all mailboxes
    public async listMailboxes(): Promise<IMailbox[]> {
        const response: AxiosResponse =
        await axios.get(`${config.serverAddress}/mailboxes`);
        return response.data.data;
    }

    //list all messages from a specific mailbox
    public async listMessages(inMailbox: string):Promise<IMessage[]> {
        const response: AxiosResponse = await axios.get(
            `${config.serverAddress}/mailboxes/${inMailbox}`
        );
         return response.data.data;
    }

    //get the body of a message
    public async getMessageBody(inID: string, inMailbox: String):Promise<string> {
        const response: AxiosResponse = await axios.get(
        `${config.serverAddress}/messages/${inMailbox}/${inID}`
        );
        return response.data;
    }

    //delete a message
    public async deleteMessage(inID: string, inMailbox: String):Promise<void> {
        await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
    }

}