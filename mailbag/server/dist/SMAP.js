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
const nodemailer = __importStar(require("nodemailer"));
//export Worker to perform SMTP
class Worker {
    constructor(inServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    //inOptions Object including: to, from, subject and text
    //return: string(success:null; error: error message)
    sendMessage(inOptions) {
        console.log("SMTP.Worker.sendMessage()", inOptions);
        return new Promise((inResolve, inReject) => {
            //use transport to send mail
            const transport = nodemailer.createTransport(Worker.serverInfo.smtp);
            console.log(Worker.serverInfo.smtp);
            transport.sendMail(inOptions, //message details from the client
            (inError, inInfo) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve("");
                }
            });
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=SMAP.js.map