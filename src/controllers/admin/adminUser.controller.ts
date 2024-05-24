import { Request, Response } from "express";
import { UserRoleEnum } from "../../constant/constant";
import { HTTPStatusCode } from "../../constant/httpStatusCode";
import User from "../../models/user.models";
import { ResponseWrapper } from "../../utils/responseWrapper";

export const createAdminUserController = async (
  req: Request,
  res: Response
) => {
  const { body } = req;

  // Set user role to subAdmin
  body.userRole = UserRoleEnum.subAdmin;

  // Set a default password for subadmin (you might want to implement a more secure way)
  body.password = "subadmin";

  // Create a new sub-admin user
  const subadminData = new User(body);

  // Save the new sub-admin user to the database
  const result = await subadminData.save();

  // Return success response
  return ResponseWrapper(res, {
    message: "admin user created successfully",
    statusCode: HTTPStatusCode.Ok,
    data: result,
  });
};

export const getAllAdminUserController = async (
  req: Request,
  res: Response
) => {
  const userData = await User.find({});
  const result = userData.filter(
    (res) => res.userRole === UserRoleEnum.subAdmin
  );
  return ResponseWrapper(res, {
    message: "admin user get sucessfull",
    statusCode: HTTPStatusCode.Ok,
    data: result,
  });
};

export const updateAdminUserController = async (
  req: Request,
  res: Response
) => {
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
    { _id: req.params.adminUserId },
    req.body
  );
  return ResponseWrapper(res, {
    message: "admin user Updated sucessfull",
    statusCode: HTTPStatusCode.Ok,
    data: userData,
  });
};

export const deleteAdminUserController = async (
  req: Request,
  res: Response
) => {
  if (!req.params?.adminUserId) {
    return ResponseWrapper(res, {
      message: "Admin user is missing",
      statusCode: HTTPStatusCode.Ok,
    });
  }

  const userData = await User.findOneAndDelete({ _id: req.params.adminUserId });

  if (!userData) {
    return ResponseWrapper(res, {
      message: "Admin user is not found",
      statusCode: HTTPStatusCode.Ok,
    });
  }

  return ResponseWrapper(res, {
    message: "Admin user is deleted sucessfull",
    statusCode: HTTPStatusCode.Ok,
  });
};
