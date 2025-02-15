"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.methodNotAllowed = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const methodNotAllowed = (req, res, next) => {
    next(http_errors_1.default.MethodNotAllowed());
};
exports.methodNotAllowed = methodNotAllowed;
const errorHandler = (err, req, res, next) => {
    const code = err.statusCode || 500;
    res.status(code).json({
        status: code,
        data: null,
        message: err.message,
    });
    next();
};
exports.errorHandler = errorHandler;
