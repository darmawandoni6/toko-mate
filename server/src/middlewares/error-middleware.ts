import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import createHttpError, { HttpError } from "http-errors";

import { prisma } from "@config/prisma";
import { Prisma } from "@prisma/client";

export const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.MethodNotAllowed());
};

export const errorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  const code = err.statusCode || 500;

  let message = err.message;
  let meta: Record<string, unknown> | undefined;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    meta = err.meta;
    message = err.meta ? (err.meta?.message as string) : err.message;
  }

  res.status(code).json({
    status: code,
    data: null,
    message,
    meta,
  });
  next();
};
