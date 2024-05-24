import { Request, Response } from "express";
import { HTTPStatusCode } from "../../constant/httpStatusCode";
import AdminRole from "../../models/role.model";
import { ResponseWrapper } from "../../utils/responseWrapper";

export const createAdminRoleController = async (
  req: Request,
  res: Response
) => {
  const roleData = new AdminRole(req.body);
  const result = await roleData.save();

  return ResponseWrapper(res, {
    statusCode: HTTPStatusCode.Created,
    message: "admin role created sucessfull",
    data: result,
  });
};

export const getAllAdminRoleController = async (
  req: Request,
  res: Response
) => {
  const result = await AdminRole.find({}).populate({
    path: "userId",
    select: "firstName lastName email", // Include only the specified fields from the user
  });

  return ResponseWrapper(res, {
    statusCode: HTTPStatusCode.Created,
    message: "Admin role get sucessfull",
    data: result,
  });
};

export const updateAdminRoleController = async (
  req: Request,
  res: Response
) => {
  const { adminRoleId } = req.params;

  const result = await AdminRole.findOneAndUpdate(
    { _id: adminRoleId },
    req.body
  );

  return ResponseWrapper(res, {
    statusCode: HTTPStatusCode.Created,
    message: "Admin role updated sucessfull",
    data: result,
  });
};

export const deleteAdminRoleController = async (
  req: Request,
  res: Response
) => {
  const { adminRoleId } = req.params;

  const result = await AdminRole.findOneAndDelete({ _id: adminRoleId });

  return ResponseWrapper(res, {
    statusCode: HTTPStatusCode.Created,
    message: "Admin role deleted sucessfull",
    data: result,
  });
};
