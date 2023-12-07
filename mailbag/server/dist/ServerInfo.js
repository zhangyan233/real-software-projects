"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
//import Node path
const path = require("path");
const fs = require("fs");
//read serverInfo.json and create s string to put information
//then get the server.information
const rawInfo = fs.readFileSync(path.join(__dirname, "../ServerInfo.json"));
exports.serverInfo = JSON.parse(rawInfo);
console.log("ServerInfo", exports.serverInfo);
//# sourceMappingURL=ServerInfo.js.map