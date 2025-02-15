"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (data) => {
    const { ACCESS_TOKEN, EXP_TOKEN } = process.env;
    const exp = Number(EXP_TOKEN);
    const token = jsonwebtoken_1.default.sign(data, ACCESS_TOKEN, { expiresIn: `${exp}D` });
    return token;
};
exports.generateToken = generateToken;
