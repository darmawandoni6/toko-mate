import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";

import { prisma } from "@config/prisma";
import { errorHandler, methodNotAllowed } from "@middleware/error-middleware";
import { AuthRouter } from "@route/auth-route";
import { DiskonRouter } from "@route/diskon-route";
import { ProdukRouter } from "@route/produk-route";
import { TransaksiRouter } from "@route/transaksi-route";

class App {
  private readonly app: express.Application;
  readonly message: string;

  constructor(port: number) {
    this.app = express();
    this.message = `[Server]: I am running mode ${process.env.NODE_ENV} at http://localhost:${port}`;
  }

  get getApp(): express.Application {
    return this.app;
  }

  init(): void {
    this.app.use(
      cors({
        origin: "http://localhost:5173", // Frontend URL
        credentials: true, // Allow credentials (cookies)
      })
    );
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.registerRoute();
  }

  private registerRoute(): void {
    this.app.get("/", (_, res) => {
      res.send({ message: this.message });
    });

    this.app.use("/uploads", express.static("uploads"));

    const auth = new AuthRouter(prisma);
    this.app.use("/api-v1", auth.route);

    const produk = new ProdukRouter(prisma);
    this.app.use("/api-v1", produk.route);

    const transaksi = new TransaksiRouter(prisma);
    this.app.use("/api-v1", transaksi.route);

    const diskon = new DiskonRouter(prisma);
    this.app.use("/api-v1", diskon.route);

    this.app.use(methodNotAllowed);
    this.app.use(errorHandler);
  }
}

export default App;
