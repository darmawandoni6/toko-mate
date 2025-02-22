import { NextFunction, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "@repository/auth/auth-repo";
import { AuthUsecase } from "@usecase/auth/auth-uc";

export class AuthController {
  private readonly uc: AuthUsecase;

  constructor(prisma: PrismaClient) {
    const repo = new AuthRepository(prisma);
    this.uc = new AuthUsecase(repo);
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.uc.bodyRegister = req.body;
      await this.uc.checkAccount();
      const result = await this.uc.register();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.uc.bodyLogin = req.body;

      const result = await this.uc.login(res);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;

      const payload = await this.uc.profile(email, toko_id);

      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  };
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, toko_id } = res.locals;
      this.uc.bodyUpdate = req.body;
      const payload = await this.uc.UpdateProfile(email, toko_id);
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  };
}
