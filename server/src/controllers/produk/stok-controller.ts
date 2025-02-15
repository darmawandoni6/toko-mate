import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { StokRepository } from "@repository/produk/stok-repo";
import { StokUsecase } from "@usecase/produk/stok-uc";
import { QueryPage } from "@usecase/produk/types";

export class StokController {
  private readonly uc: StokUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new StokRepository(prisma);
    this.uc = new StokUsecase(repo);
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;
      this.uc.setCreate = req.body;
      const result = await this.uc.create(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: QueryPage = {
        page: Number(req.query.page),
        pageSize: Number(req.query.pageSize),
      };
      const result = await this.uc.list(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
