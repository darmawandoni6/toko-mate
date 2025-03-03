import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";

import { errorHandler, methodNotAllowed } from "@middleware/error-middleware";
import { PrismaClient } from "@prisma/client";
import { AuthRouter } from "@route/auth-route";
import { DiskonRouter } from "@route/diskon-route";
import { ProdukRouter } from "@route/produk-route";
import { TransaksiRouter } from "@route/transaksi-route";

class App {
  private readonly app: express.Application;
  private readonly prisma: PrismaClient;
  readonly message: string;

  constructor(port: number, prisma: PrismaClient) {
    this.app = express();
    this.message = `[Server]: I am running mode ${process.env.NODE_ENV} at http://localhost:${port}`;
    this.prisma = prisma;
  }

  get getApp(): express.Application {
    return this.app;
  }

  init(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:5173", "https://z8gvcb8g-5173.asse.devtunnels.ms"], // Frontend URL
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

    // this.app.use(async (req, res, next) => {
    //   await new Promise<void>((res) => {
    //     const random = Math.floor(Math.random() * (2 - 0 + 1)) + 0;

    //     setTimeout(() => {
    //       res();
    //     }, random * 1000);
    //   });
    //   next();
    // });

    const auth = new AuthRouter(this.prisma);
    this.app.use("/api-v1", auth.route);

    const produk = new ProdukRouter(this.prisma);
    this.app.use("/api-v1", produk.route);

    const transaksi = new TransaksiRouter(this.prisma);
    this.app.use("/api-v1", transaksi.route);

    const diskon = new DiskonRouter(this.prisma);
    this.app.use("/api-v1", diskon.route);

    this.app.use(methodNotAllowed);
    this.app.use(errorHandler);
  }
}

export default App;
