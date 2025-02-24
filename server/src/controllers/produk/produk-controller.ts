import { NextFunction, Request, Response } from "express";

import multer from "multer";

import { PrismaClient } from "@prisma/client";
import { ProdukRepository } from "@repository/produk/produk-repo";
import { ProdukUsecase } from "@usecase/produk/produk-uc";
import { ListQuery } from "@usecase/produk/types";
import { diskStorage, fileFilter } from "@util/multer";

export class ProdukController {
  private readonly uc: ProdukUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new ProdukRepository(prisma);
    this.uc = new ProdukUsecase(repo);
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
  detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.detail(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  detailSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataDetail = req.body;
      const result = await this.uc.detailWithoutId();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const query: ListQuery = {
        ...req.query,
        page: Number(req.query.page),
        pageSize: Number(req.query.pageSize),
      };

      const result = await this.uc.list(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  updateImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    multer({ storage: diskStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).single("produk")(
      req,
      res,
      async (err) => {
        try {
          if (err) {
            throw err;
          }

          const { toko_id } = res.locals;
          this.uc.toko_id = toko_id;

          const file = this.uc.validateImage(req.file, req.body.prev_image);

          const result = await this.uc.updateImage(req.params.id, file.path);
          res.status(200).json(result);
        } catch (error) {
          this.uc.validateImage(undefined, req.body.prev_image);
          next(error);
        }
      }
    );
  };
}
