import express from "express";

import { TransaksiController } from "@controller/transaksi/transaksi-controller";
import { authorized } from "@middleware/authorized";
import { PrismaClient } from "@prisma/client";

export class TransaksiRouter {
  private readonly c_transaksi: TransaksiController;

  constructor(prisma: PrismaClient) {
    this.c_transaksi = new TransaksiController(prisma);
  }

  get route() {
    const router = express.Router();

    router.post("/transaksi", authorized, this.c_transaksi.create);
    router.get("/transaksi", authorized, this.c_transaksi.getPending);
    router.get("/transaksi-report", authorized, this.c_transaksi.getSuccess);
    router.delete("/transaksi/:id", authorized, this.c_transaksi.remove);
    router.post("/transaksi-payment/:id", authorized, this.c_transaksi.payment);

    router.get("/transaksi-detail/:transaksi_id", authorized, this.c_transaksi.listItem);
    router.post("/transaksi-detail", authorized, this.c_transaksi.addItem);
    router.put("/transaksi-detail/:id/:transaksi_id", authorized, this.c_transaksi.updateItem);
    router.delete("/transaksi-detail/:id/:transaksi_id", authorized, this.c_transaksi.removeItem);

    router.get("/transaksi-per-hari", authorized, this.c_transaksi.transaksiPerHari);
    router.get("/transaksi-report/:date", authorized, this.c_transaksi.test);
    return router;
  }
}
