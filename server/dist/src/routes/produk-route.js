"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdukRouter = void 0;
const express_1 = __importDefault(require("express"));
const kategori_controller_1 = require("../controllers/produk/kategori-controller");
const produk_controller_1 = require("../controllers/produk/produk-controller");
const stok_controller_1 = require("../controllers/produk/stok-controller");
const authorized_1 = require("../middlewares/authorized");
class ProdukRouter {
    c_kategori;
    c_produk;
    c_stok;
    constructor(prisma) {
        this.c_kategori = new kategori_controller_1.KategoriController(prisma);
        this.c_produk = new produk_controller_1.ProdukController(prisma);
        this.c_stok = new stok_controller_1.StokController(prisma);
    }
    get route() {
        const router = express_1.default.Router();
        router.get("/kategori", authorized_1.authorized, this.c_kategori.list);
        router.post("/kategori", authorized_1.authorized, this.c_kategori.create);
        router.put("/kategori/:id", authorized_1.authorized, this.c_kategori.update);
        router.delete("/kategori/:id", authorized_1.authorized, this.c_kategori.remove);
        router.get("/produk", authorized_1.authorized, this.c_produk.list);
        router.post("/produk", authorized_1.authorized, this.c_produk.create);
        router.put("/produk/:id", authorized_1.authorized, this.c_produk.update);
        router.delete("/produk/:id", authorized_1.authorized, this.c_produk.remove);
        router.get("/produk-stok", authorized_1.authorized, this.c_stok.list);
        router.post("/produk-stok", authorized_1.authorized, this.c_stok.create);
        return router;
    }
}
exports.ProdukRouter = ProdukRouter;
