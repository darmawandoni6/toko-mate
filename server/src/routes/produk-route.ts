import express from "express";

import { KategoriController } from "@controller/produk/kategori-controller";
import { ProdukController } from "@controller/produk/produk-controller";
import { StokController } from "@controller/produk/stok-controller";
import { authorized } from "@middleware/authorized";
import { PrismaClient } from "@prisma/client";

export class ProdukRouter {
  private readonly c_kategori: KategoriController;
  private readonly c_produk: ProdukController;
  private readonly c_stok: StokController;

  constructor(prisma: PrismaClient) {
    this.c_kategori = new KategoriController(prisma);
    this.c_produk = new ProdukController(prisma);
    this.c_stok = new StokController(prisma);
  }

  get route() {
    const router = express.Router();

    router.get("/kategori", authorized, this.c_kategori.list);
    router.post("/kategori", authorized, this.c_kategori.create);
    router.put("/kategori/:id", authorized, this.c_kategori.update);
    router.delete("/kategori/:id", authorized, this.c_kategori.remove);

    router.get("/produk", authorized, this.c_produk.list);
    router.post("/produk", authorized, this.c_produk.create);
    router.post("/produk-search", authorized, this.c_produk.detailSearch);
    router.get("/produk/:id", authorized, this.c_produk.detail);
    router.put("/produk/:id", authorized, this.c_produk.update);
    router.delete("/produk/:id", authorized, this.c_produk.remove);

    router.get("/produk-stok", authorized, this.c_stok.list);
    router.post("/produk-stok", authorized, this.c_stok.create);

    return router;
  }
}
