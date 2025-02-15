"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_repo_1 = require("../../repository/auth/auth-repo");
const auth_uc_1 = require("../../usecase/auth/auth-uc");
class AuthController {
    uc;
    constructor(prisma) {
        const repo = new auth_repo_1.AuthRepository(prisma);
        this.uc = new auth_uc_1.AuthUsecase(repo);
    }
    register = async (req, res, next) => {
        try {
            this.uc.dataRegister = req.body;
            await this.uc.checkAccount();
            const result = await this.uc.register();
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            this.uc.dataRegister = req.body;
            const result = await this.uc.login(res);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    profile = async (req, res, next) => {
        try {
            const { email, toko_id } = res.locals;
            const payload = await this.uc.profile(email, toko_id);
            res.status(200).json(payload);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
