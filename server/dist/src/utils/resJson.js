"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resJson = void 0;
const resJson = (code, data, pagination) => {
    return {
        status: code,
        data: data ?? null,
        message: "success",
        pagination,
    };
};
exports.resJson = resJson;
