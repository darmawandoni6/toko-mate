"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorized = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            next(http_errors_1.default.Unauthorized());
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, (error, payload) => {
            if (error) {
                const err = error;
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                next(http_errors_1.default.Unauthorized(message));
                return;
            }
            res.locals = payload;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.authorized = authorized;
