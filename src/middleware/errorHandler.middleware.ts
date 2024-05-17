import { NextFunction, Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";

// Error object used in error handling middleware function
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

// Custom Error Interface
interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || HTTPStatusCode.InternalServerError;
  const errorMessage = err.message || "Internal Server Error";

  // Logging the error stack in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Responding with structured error response
  res.status(statusCode).json({
    status: statusCode,
    error: {
      message: errorMessage,
    },
  });
};
