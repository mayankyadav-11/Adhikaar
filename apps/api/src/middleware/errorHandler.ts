import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: "NOT_FOUND",
      status: 404,
    },
  });
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isDev = env.NODE_ENV === "development" || env.NODE_ENV === "test";

  console.error(`[Error] ${statusCode} - ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: {
      message: statusCode === 500 && !isDev ? "Internal server error" : err.message,
      code: err.code || "INTERNAL_SERVER_ERROR",
      status: statusCode,
      ...(isDev && err.stack ? { stack: err.stack } : {}),
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
