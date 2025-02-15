"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdukUsecase = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const joi_1 = __importDefault(require("joi"));
const resJson_1 = require("../../utils/resJson");
class ProdukUsecase {
    repo;
    data_create;
    data_update;
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
            barcode: joi_1.default.string().required(),
            kategori_id: joi_1.default.string().required(),
            nama: joi_1.default.string().required(),
            harga_beli: joi_1.default.number().required(),
            harga_jual: joi_1.default.number().required(),
            total_stok: joi_1.default.number().required(),
        }),
        update: joi_1.default.object({
            barcode: joi_1.default.string(),
            kategori_id: joi_1.default.string(),
            nama: joi_1.default.string(),
            harga_beli: joi_1.default.number(),
            harga_jual: joi_1.default.number(),
            total_stok: joi_1.default.number(),
        }),
        list: joi_1.default.object({
            page: joi_1.default.number().required(),
            pageSize: joi_1.default.number().required(),
            barcode: joi_1.default.string(),
            nama: joi_1.default.string(),
        }),
    };
    set dataCreate(payload) {
        const data = this.validate(this.validationSchemas.create, payload);
        this.data_create = data;
    }
    set dataUpdate(payload) {
        const data = this.validate(this.validationSchemas.update, payload);
        this.data_update = data;
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
    async detail(id) {
        const result = await this.repo.detail(id);
        return this.result(result);
    }
    async list(query) {
        const payload = this.validate(this.validationSchemas.list, query);
        const where = {};
        if (payload.barcode) {
            where.barcode = payload.barcode;
        }
        if (payload.nama) {
            where.nama = {
                contains: payload.nama,
                mode: "insensitive",
            };
        }
        const result = await this.repo.list(payload.page, payload.pageSize, where);
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
exports.ProdukUsecase = ProdukUsecase;
