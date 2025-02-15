"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setError = void 0;
const setError = (code, error) => {
    const str = { [code]: error.message };
    return new Error(JSON.stringify(str));
};
exports.setError = setError;
