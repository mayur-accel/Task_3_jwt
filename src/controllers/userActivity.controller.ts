import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { UserActivity } from "../models/log.model";
import { ResponseWrapper } from "../utils/responseWrapper";

export const getUserActivityController = async (
  req: Request,
  res: Response
) => {
  const user: any = req.user;

  const userActivity = await UserActivity.find({
    userId: user.id,
    ...req.query,
  });

  const result = {
    totalActivity: userActivity.length,
    activityData: userActivity,
  };

  return ResponseWrapper(res, {
    statusCode: HTTPStatusCode.Ok,
    message: "User activity get sucessfull",
    data: result,
  });
};
