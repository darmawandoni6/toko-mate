"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KategoriUsecase = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const joi_1 = __importDefault(require("joi"));
const resJson_1 = require("../../utils/resJson");
class KategoriUsecase {
    repo;
    data_create;
    data_update;
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
    validationSchemas = {
        create: joi_1.default.object({
            nama: joi_1.default.string().required(),
        }),
        update: joi_1.default.object({
            nama: joi_1.default.string(),
            status: joi_1.default.boolean(),
        }),
    };
    set dataCreate(payload) {
        const data = this.validate(this.validationSchemas.create, payload);
        this.data_create = {
            nama: data.nama,
            status: true,
        };
    }
    set dataUpdate(payload) {
        const data = this.validate(this.validationSchemas.update, payload);
        this.data_update = {
            nama: data.nama,
            status: data.status,
        };
    }
    async create() {
        await this.repo.create(this.data_create);
        return this.result();
    }
    async update(id) {
        await this.repo.update(id, this.data_update);
        return this.result();
    }
    async remove(id) {
        await this.repo.remove(id);
        return this.result();
    }
    async list() {
        const res = await this.repo.list();
        return this.result(res);
    }
}
exports.KategoriUsecase = KategoriUsecase;
