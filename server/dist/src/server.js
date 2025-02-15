"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = Number(process.env.PORT) || 3000;
const main = async () => {
    try {
        const app = new app_1.default(port);
        app.init();
        const server = http_1.default.createServer(app.getApp);
        server.listen(port, () => console.log(app.message));
    }
    catch (error) {
        console.log(error);
        process.exit(-1);
    }
};
main();
