"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: ["error"],
    errorFormat: "pretty",
    transactionOptions: {
        maxWait: 5000,
        timeout: 15000,
    },
});
