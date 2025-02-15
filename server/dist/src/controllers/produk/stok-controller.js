"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StokController = void 0;
const stok_repo_1 = require("../../repository/produk/stok-repo");
const stok_uc_1 = require("../../usecase/produk/stok-uc");
class StokController {
    uc;
    constructor(prisma) {
        const repo = new stok_repo_1.StokRepository(prisma);
        this.uc = new stok_uc_1.StokUsecase(repo);
    }
    create = async (req, res, next) => {
        try {
            const { email } = res.locals;
            this.uc.setCreate = req.body;
            const result = await this.uc.create(email);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const query = {
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
exports.StokController = StokController;
