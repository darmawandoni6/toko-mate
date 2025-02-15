"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KategoriController = void 0;
const kategori_repo_1 = require("../../repository/produk/kategori-repo");
const kategori_uc_1 = require("../../usecase/produk/kategori-uc");
class KategoriController {
    uc;
    constructor(prisma) {
        const repo = new kategori_repo_1.KategoriRepository(prisma);
        this.uc = new kategori_uc_1.KategoriUsecase(repo);
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
    list = async (req, res, next) => {
        try {
            const result = await this.uc.list();
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.KategoriController = KategoriController;
