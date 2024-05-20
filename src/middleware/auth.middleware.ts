import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "./errorHandler.middleware";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        HTTPStatusCode.BadRequest,
        "Token is missing or malformed"
      );
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.SECRET_KEY || "";

    if (!secretKey) {
      throw new AppError(500, "Internal server error");
    }

    // Verify the token
    jwt.verify(token, secretKey) as JwtPayload;

    // You can add additional checks on the decoded payload if needed
    // For example, checking user roles or permissions

    // Attach the decoded payload to the request object for further use
    // req.body = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // JWT specific errors
      next(new AppError(HTTPStatusCode.Unauthorized, "Token is not valid"));
    } else {
      // General errors
      next(err);
    }
  }
};
