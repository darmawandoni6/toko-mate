import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { TransaksiDetailRepository } from "@repository/transaksi/transaksi-detail-repo";
import { TransaksiRepository } from "@repository/transaksi/transaksi-repo";
import { TransaksiUsecase } from "@usecase/transaksi/transaksi-uc";
import { QueryPage } from "@usecase/transaksi/types";

export class TransaksiController {
  private readonly uc: TransaksiUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new TransaksiRepository(prisma);
    const repo_detail = new TransaksiDetailRepository(prisma);
    this.uc = new TransaksiUsecase(repo, repo_detail);
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataCreate = req.body;
      const result = await this.uc.create(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  getPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.list(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  getSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const query: QueryPage = {
        page: Number(req.query.page),
        pageSize: Number(req.query.pageSize),
      };
      const result = await this.uc.listReport(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.remove(req.params.id, email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  payment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataPayment = req.body;
      const result = await this.uc.payment(req.params.id, email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  listItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.listItem(req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataItem = req.body;
      let result = await this.uc.checkItem();

      if (result) {
        res.status(200).json(result);
        return;
      }
      result = await this.uc.addItem();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      this.uc.dataUpdateItem = req.body;
      const result = await this.uc.updateItem(req.params.id, req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.removeItem(req.params.id, req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  transaksiPerHari = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.transaksiPerHari(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  report = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toko_id } = res.locals;
      this.uc.toko_id = toko_id;

      const result = await this.uc.transaksiReport(new Date(req.params.date));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
