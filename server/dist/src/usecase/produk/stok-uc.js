"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StokUsecase = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const joi_1 = __importDefault(require("joi"));
const resJson_1 = require("../../utils/resJson");
class StokUsecase {
    repo;
    data_create;
    data_update_produk;
    constructor(repo) {
        this.repo = repo;
    }
    result(data, pagination) {
        return (0, resJson_1.resJson)(200, data, pagination);
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
            produk_id: joi_1.default.string().required(),
            qty: joi_1.default.number().required(),
            produk: joi_1.default.object({
                harga_beli: joi_1.default.number().required(),
                harga_jual: joi_1.default.number().required(),
            }).required(),
        }),
        listQuery: joi_1.default.object({
            page: joi_1.default.number().required(),
            pageSize: joi_1.default.number().required(),
        }),
    };
    set setCreate(payload) {
        const { produk, ...data } = this.validate(this.validationSchemas.create, payload);
        this.data_create = {
            produk_id: data.produk_id,
            qty: data.qty,
            deskripsi: data.deskripsi,
            email: data.email,
        };
        this.data_update_produk = produk;
    }
    async create(email) {
        this.data_create.email = email;
        await this.repo.create(this.data_create, this.data_update_produk);
        return this.result();
    }
    async list(query) {
        const payload = this.validate(this.validationSchemas.listQuery, query);
        const result = await this.repo.list(query.page, query.pageSize);
        const count = await this.repo.listCount();
        const pagination = {
            page: payload.page,
            limit: payload.pageSize,
            lastPage: Math.ceil(count / payload.pageSize),
            total: count,
        };
        return this.result(result, pagination);
    }
}
exports.StokUsecase = StokUsecase;
