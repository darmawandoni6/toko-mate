import express from "express";

import { AuthController } from "@controller/auth/auth-controller";
import { authorized } from "@middleware/authorized";
import { PrismaClient } from "@prisma/client";

export class AuthRouter {
  private readonly controller: AuthController;
  constructor(prisma: PrismaClient) {
    this.controller = new AuthController(prisma);
  }

  get route() {
    const router = express.Router();
    router.post("/login", this.controller.login);
    router.post("/register", this.controller.register);
    router.get("/profile", authorized, this.controller.profile);
    router.put("/update-profile", authorized, this.controller.updateProfile);
    return router;
  }
}
