"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterBase = void 0;
const express_1 = __importDefault(require("express"));
class RouterBase {
    r;
    constructor() {
        this.r = express_1.default.Router();
        this.routes();
    }
    get router() {
        return this.r;
    }
}
exports.RouterBase = RouterBase;
