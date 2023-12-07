
//import Axio
import axios,{AxiosResponse} from "axios";

//import config
import {config} from "./config";

//describe the contact
export interface IContact{
    _id?:number,
    name: string,
    email:string
}

export class Worker{
    
    //get the list of contacts
    public async listContacts(): Promise<IContact[]> {
        const response: AxiosResponse =
        await axios.get(`${config.serverAddress}/contacts`);
        return response.data.data;
       }

    //add a contact
    public async addContact(inContact: IContact):
        Promise<IContact> {
        const response: AxiosResponse = await axios.post(`${config.serverAddress}/contacts`, inContact);
        return response.data.data;
    }

    //update a contact
    public async updateContact(inContact: IContact): Promise<IContact> {
        const response: AxiosResponse = await axios.put(`${config.serverAddress}/contacts`, inContact);
        return response.data.data;
      } 

    //delete a contact
    public async deleteContact(inID:any): Promise<void> {
        await axios.delete(
        `${config.serverAddress}/contacts/${inID}`);
       }
}