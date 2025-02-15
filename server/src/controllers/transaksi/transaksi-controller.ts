import { NextFunction, Request, Response } from "express";

import { prisma } from "@config/prisma";
import { Prisma, PrismaClient, Transaksi } from "@prisma/client";
import { TransaksiDetailRepository } from "@repository/transaksi/transaksi-detail-repo";
import { TransaksiRepository } from "@repository/transaksi/transaksi-repo";
import { TransaksiUsecase } from "@usecase/transaksi/transaksi-uc";
import { QueryPage } from "@usecase/transaksi/types";

// export async function test(req: Request, res: Response, next: NextFunction): Promise<void> {
//   try {
//     const { email } = res.locals;
//     // const test:Transaksi =

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const prev14 = new Date(today);
//     let weak = 0;

//     while (weak !== 2) {
//       prev14.setDate(prev14.getDate() - 1);
//       if (prev14.getDay() === 0) {
//         weak += 1;
//       }
//     }
//     prev14.setDate(prev14.getDate() + 1);

//     const result = await prisma.transaksi.findMany({
//       where: {
//         updated_at: {
//           gte: prev14,
//           lte: today,
//         },
//       },
//       orderBy: {
//         updated_at: "desc",
//       },
//     });

//     weak = 0;
//     const data = result.reduce(
//       (acc, item) => {
//         const x = new Date(item.updated_at);
//         if (x.getDay() === 0) {
//           weak += 1;
//         }
//         acc[`week_${weak}`] = acc[`week_${weak}`] ?? 0 + Number(item.total);

//         return acc;
//       },
//       {} as { [k: string]: number }
//     );

//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// }
export class TransaksiController {
  private readonly uc: TransaksiUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new TransaksiRepository(prisma);
    const repo_detail = new TransaksiDetailRepository(prisma);
    this.uc = new TransaksiUsecase(repo, repo_detail);
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;

      this.uc.dataCreate = req.body;
      const result = await this.uc.create(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  getPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;
      const result = await this.uc.list(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  getSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
      const { email } = res.locals;
      const result = await this.uc.remove(req.params.id, email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  payment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;

      this.uc.dataPayment = req.body;
      const result = await this.uc.payment(req.params.id, email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  listItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.uc.listItem(req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.uc.dataItem = req.body;
      let result = await this.uc.checkItem();
      console.log({ result });

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
      this.uc.dataUpdateItem = req.body;
      const result = await this.uc.updateItem(req.params.id, req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.uc.removeItem(req.params.id, req.params.transaksi_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  transaksiPerHari = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;
      const result = await this.uc.transaksiPerHari(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  test = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = res.locals;
      const result = await this.uc.transaksiReport(email, new Date(req.params.date));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
