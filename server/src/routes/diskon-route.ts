import express from "express";

import { DiskonController } from "@controller/diskon/diskon-controller";
import { authorized } from "@middleware/authorized";
import { PrismaClient } from "@prisma/client";

export class DiskonRouter {
  private readonly controller: DiskonController;
  constructor(prisma: PrismaClient) {
    this.controller = new DiskonController(prisma);
  }

  get route() {
    const router = express.Router();
    router.post("/diskon", authorized, this.controller.create);
    router.get("/diskon", authorized, this.controller.list);
    router.get("/diskon-all", authorized, this.controller.listOption);
    router.put("/diskon/:id", authorized, this.controller.update);
    router.get("/diskon/:id", authorized, this.controller.detail);
    router.delete("/diskon/:id", authorized, this.controller.remove);
    return router;
  }
}
