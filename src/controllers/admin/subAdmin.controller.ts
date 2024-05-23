import { Request, Response } from "express";
import { UserRoleEnum } from "../../constant/constant";
import { HTTPStatusCode } from "../../constant/httpStatusCode";
import User from "../../models/user.models";
import { ResponseWrapper } from "../../utils/responseWrapper";

export const createSubAdminController = async (req: Request, res: Response) => {
  const body: any = req.body;
  body.userRole = UserRoleEnum.subAdmin;
  body.password = "subadmin";

  const subadminData = new User(body);
  const result = await subadminData.save();

  return ResponseWrapper(res, {
    message: "Sub admin is created sucessfull",
    statusCode: HTTPStatusCode.Ok,
    data: result,
  });
};

export const getAllSubAdminController = async (req: Request, res: Response) => {
  const userData = await User.find({});
  const result = userData.filter(
    (res) => res.userRole === UserRoleEnum.subAdmin
  );
  return ResponseWrapper(res, {
    message: "Sub admin get sucessfull",
    statusCode: HTTPStatusCode.Ok,
    data: result,
  });
};

export const updateSubAdminController = async (req: Request, res: Response) => {
  if (
    req.body.hasOwnProperty("email") ||
    req.body.hasOwnProperty("googleId") ||
    req.body.hasOwnProperty("password")
  ) {
    return ResponseWrapper(res, {
      message: "Invalid field are enter please remove it",
      statusCode: HTTPStatusCode.BadRequest,
    });
  }

  const userData = await User.findOneAndUpdate(
    { _id: req.params.subadminId },
    req.body
  );
  return ResponseWrapper(res, {
    message: "Sub admin Updated sucessfull",
    statusCode: HTTPStatusCode.Ok,
    data: userData,
  });
};

export const deleteSubAdminController = async (req: Request, res: Response) => {
  if (!req.params?.subadminId) {
    return ResponseWrapper(res, {
      message: "subadmin is missing",
      statusCode: HTTPStatusCode.Ok,
    });
  }

  const userData = await User.findOneAndDelete({ _id: req.params.subadminId });

  if (!userData) {
    return ResponseWrapper(res, {
      message: "Subadmin is not found",
      statusCode: HTTPStatusCode.Ok,
    });
  }

  return ResponseWrapper(res, {
    message: "Subadmin is deleted sucessfull",
    statusCode: HTTPStatusCode.Ok,
  });
};
