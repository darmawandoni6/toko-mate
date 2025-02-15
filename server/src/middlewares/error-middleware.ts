import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import createHttpError, { HttpError } from "http-errors";

export const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError.MethodNotAllowed());
};

export const errorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  const code = err.statusCode || 500;
  res.status(code).json({
    status: code,
    data: null,
    message: err.message,
  });
  next();
};
