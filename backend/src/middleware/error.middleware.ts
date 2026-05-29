import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

type ErrorResponse = {
  error: {
    message: string;
    code: string;
  };
};

export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, code: err.code },
    });
  }

  logger.error("unhandled error", { err });
  return res.status(500).json({
    error: { message: "Internal Server Error", code: "INTERNAL_ERROR" },
  });
}

