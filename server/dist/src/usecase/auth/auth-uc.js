"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUsecase = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = require("../../utils/bcrypt");
const resJson_1 = require("../../utils/resJson");
const token_1 = require("../../utils/token");
class AuthUsecase {
    repo;
    data;
    body_login;
    constructor(repo) {
        this.repo = repo;
    }
    result(data) {
        return (0, resJson_1.resJson)(200, data);
    }
    validate(schema, payload) {
        const { error, value } = schema.validate(payload);
        if (error) {
            throw new http_errors_1.default.BadRequest(error.message);
        }
        return value;
    }
    validationSchema = {
        register: joi_1.default.object({
            nama: joi_1.default.string().required(),
            alamat: joi_1.default.string().required(),
            hp: joi_1.default.string().required(),
            user: joi_1.default.object({
                email: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
            }).required(),
        }),
        login: joi_1.default.object({
            email: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        }),
    };
    set dataRegister(payload) {
        const { user, ...body } = this.validate(this.validationSchema.register, payload);
        this.data = {
            nama: body.nama,
            alamat: body.alamat,
            hp: body.hp,
            user: {
                create: {
                    email: user.email,
                    password: (0, bcrypt_1.encrypt)(user.password),
                },
            },
        };
    }
    set bodyLogin(payload) {
        const body = this.validate(this.validationSchema.login, payload);
        this.body_login = body;
    }
    async checkAccount() {
        const res = await this.repo.find(this.dataRegister.user.email);
        if (res) {
            throw http_errors_1.default.Conflict(`${this.dataRegister.user.email} sudah digunakan`);
        }
    }
    async register() {
        await this.repo.register(this.data);
        return this.result();
    }
    async login(res) {
        const user = await this.repo.find(this.body_login.email);
        if (!user) {
            throw http_errors_1.default.NotFound("email/password tidak ada");
        }
        const match = (0, bcrypt_1.compare)(this.body_login.password, user.password);
        if (!match) {
            throw http_errors_1.default.NotFound("email/password tidak ada");
        }
        const token = (0, token_1.generateToken)({
            email: user.email,
            toko_id: user.toko_id,
        });
        const expired = new Date(); // Now
        expired.setDate(expired.getDate() + parseInt(process.env.EXP_TOKEN, 10));
        res.cookie("token", token, { httpOnly: true, expires: expired });
        return this.result({ token, expired });
    }
    async profile(email, toko_id) {
        const res = await this.repo.profile({ email, toko_id });
        if (!res) {
            throw http_errors_1.default.NotFound(`${email} tidak ditemukan`);
        }
        res.password = "";
        return this.result(res);
    }
}
exports.AuthUsecase = AuthUsecase;
