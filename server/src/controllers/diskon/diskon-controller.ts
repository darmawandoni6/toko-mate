import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { DiskonRepository } from "@repository/diskon/diskon-repo";
import { DiskonUsecase } from "@usecase/diskon/diskon-uc";
import { QueryPage } from "@usecase/diskon/types";

export class DiskonController {
  private readonly uc: DiskonUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new DiskonRepository(prisma);
    this.uc = new DiskonUsecase(repo);
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
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

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
  listOption = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.listOption();
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
}
