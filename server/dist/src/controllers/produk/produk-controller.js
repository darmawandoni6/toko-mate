"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdukController = void 0;
const produk_repo_1 = require("../../repository/produk/produk-repo");
const produk_uc_1 = require("../../usecase/produk/produk-uc");
class ProdukController {
    uc;
    constructor(prisma) {
        const repo = new produk_repo_1.ProdukRepository(prisma);
        this.uc = new produk_uc_1.ProdukUsecase(repo);
    }
    create = async (req, res, next) => {
        try {
            this.uc.dataCreate = req.body;
            const result = await this.uc.create();
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            this.uc.dataUpdate = req.body;
            const result = await this.uc.update(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            const result = await this.uc.remove(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    detail = async (req, res, next) => {
        try {
            const result = await this.uc.detail(req.params.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = {
                ...req.query,
                page: Number(req.query.page),
                pageSize: Number(req.query.pageSize),
            };
            const result = await this.uc.list(query);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProdukController = ProdukController;
