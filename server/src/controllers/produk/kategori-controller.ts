import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { KategoriRepository } from "@repository/produk/kategori-repo";
import { KategoriUsecase } from "@usecase/produk/kategori-uc";

export class KategoriController {
  private readonly uc: KategoriUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new KategoriRepository(prisma);
    this.uc = new KategoriUsecase(repo);
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataCreate = req.body;
      const result = await this.uc.create();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataUpdate = req.body;
      const result = await this.uc.update(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.remove(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.list();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
