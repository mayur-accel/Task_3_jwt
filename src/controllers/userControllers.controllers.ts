import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import User from "../models/user.models";

export const getAllUserController = async (req: Request, res: Response) => {
  const userData = await User.find({});
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User data get sucessfull",
    data: userData,
  });
};
