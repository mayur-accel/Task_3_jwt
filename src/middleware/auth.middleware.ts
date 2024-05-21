import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRoleEnum, normalURL, proURL } from "../constant/constant";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { UserLogs } from "../models/history.model";
import { AppError } from "./errorHandler.middleware";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.baseUrl, req.originalUrl, req.url);
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
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    const result = await UserLogs.find({ userId: decoded.id, token: token });

    if (result.length !== 1 || !result[0]?.isActive) {
      throw new AppError(HTTPStatusCode.BadRequest, "Token is invalid");
    }
    // You can add additional checks on the decoded payload if needed
    // For example, checking user roles or permissions

    // Attach the decoded payload to the request object for further use

    await UserLogs.findOneAndUpdate(
      { _id: result[0]._id },
      { lastActiveTime: new Date() }
    );

    if (proURL.includes(req.url)) {
      if (decoded.userRole !== UserRoleEnum.pro) {
        next(
          new AppError(
            HTTPStatusCode.Unauthorized,
            "your not to pro url unauthorized"
          )
        );
      }
    }

    if (normalURL.includes(req.url)) {
      if (decoded.userRole === UserRoleEnum.free) {
        next(
          new AppError(
            HTTPStatusCode.Unauthorized,
            "your not to normal unauthorized"
          )
        );
      }
    }

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      if (err.name === "TokenExpiredError") {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];

        await UserLogs.findOneAndUpdate(
          { token: token },
          {
            lastActiveTime: new Date(),
            logoutTime: new Date(),
            isActive: false,
          }
        );
        return res
          .status(HTTPStatusCode.Unauthorized)
          .json({ message: "Token is not valid" });
      }
      // JWT specific errors
      next(new AppError(HTTPStatusCode.Unauthorized, "Token is not valid"));
    } else {
      // General errors
      next(err);
    }
  }
};
