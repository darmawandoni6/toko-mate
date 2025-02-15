"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth/auth-controller");
const authorized_1 = require("../middlewares/authorized");
class AuthRouter {
    controller;
    constructor(prisma) {
        this.controller = new auth_controller_1.AuthController(prisma);
    }
    get route() {
        const router = express_1.default.Router();
        router.post("/login", this.controller.login);
        router.post("/register", this.controller.register);
        router.get("/profile", authorized_1.authorized, this.controller.profile);
        return router;
    }
}
exports.AuthRouter = AuthRouter;
