//import Node path
const path= require("path");
const fs= require("fs");

//server information
export interface IServerInfo {
    smtp : {
    host: string, port: number,
    auth: { user: string, pass: string }
    },
    imap : {
    host: string, port: number,
    auth: { user: string, pass: string }
    }
}
//server info
export let serverInfo:IServerInfo;

//read serverInfo.json and create s string to put information
//then get the server.information
const rawInfo:string=fs.readFileSync(path.join(__dirname,"../ServerInfo.json"));
serverInfo=JSON.parse(rawInfo);
console.log("ServerInfo",serverInfo);