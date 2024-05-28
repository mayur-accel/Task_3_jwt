import { Request, Response } from "express";
import { UserRoleEnum } from "../constant/constant";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "../middleware/errorHandler.middleware";
import { UserLogs } from "../models/history.model";
import User from "../models/user.models";

export const getAllUserController = async (req: Request, res: Response) => {
  const userData = await User.find({});
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User data get sucessfull",
    data: userData,
  });
};

export const getUserProfileController = async (req: Request, res: Response) => {
  const data = await User.findOne({ _id: req.params.userId });

  if (!data) {
    throw new AppError(HTTPStatusCode.NotFound, "User not found");
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "user profile get sucessfull",
    data,
  });
};

export const getActiveUserController = async (req: Request, res: Response) => {
  const user: any = req.user;

  const result = await UserLogs.find({
    userId: user.id,
    isActive: true,
  });

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "active user get sucessfull",
    data: {
      totalUser: result.length,
      users: result,
    },
  });
};

export const getCheckUserRoleController = async (
  req: Request,
  res: Response
) => {
  const user: any = req.user;

  if (user.userRole === UserRoleEnum.normal) {
    return res.json({
      message: "User role is normal",
    });
  }

  if (user.userRole === UserRoleEnum.pro) {
    return res.json({
      message: "User role is pro",
    });
  }

  return res.json({
    message: "User role is free",
  });
};

export const getUserFreeURlControler = async (req: Request, res: Response) => {
  return res.json({
    message: "User role is Free",
  });
};

export const getUserNormalURlControler = async (
  req: Request,
  res: Response
) => {
  return res.json({
    message: "User role is normal",
  });
};

export const getUserProURlControler = async (req: Request, res: Response) => {
  return res.json({
    message: "User role is Pro",
  });
};

export const updateUserController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw new AppError(HTTPStatusCode.NotFound, "Request body not found");
  }

  const data = await User.findOneAndUpdate(
    { _id: req.params.userId },
    req.body
  );

  if (!data) {
    throw new AppError(HTTPStatusCode.NotFound, "User not found");
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "user profile get sucessfull",
    data,
  });
};
