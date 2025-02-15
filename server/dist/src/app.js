"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const prisma_1 = require("./config/prisma");
const error_middleware_1 = require("./middlewares/error-middleware");
const auth_route_1 = require("./routes/auth-route");
const produk_route_1 = require("./routes/produk-route");
class App {
    app;
    message;
    constructor(port) {
        this.app = (0, express_1.default)();
        this.message = `[Server]: I am running mode ${process.env.NODE_ENV} at http://localhost:${port}`;
    }
    get getApp() {
        return this.app;
    }
    init() {
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173", // Frontend URL
            credentials: true, // Allow credentials (cookies)
        }));
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, cookie_parser_1.default)());
        this.registerRoute();
    }
    registerRoute() {
        this.app.get("/", (_, res) => {
            res.send({ message: this.message });
        });
        const auth = new auth_route_1.AuthRouter(prisma_1.prisma);
        this.app.use("/api-v1", auth.route);
        const produk = new produk_route_1.ProdukRouter(prisma_1.prisma);
        this.app.use("/api-v1", produk.route);
        this.app.use(error_middleware_1.methodNotAllowed);
        this.app.use(error_middleware_1.errorHandler);
    }
}
exports.default = App;
