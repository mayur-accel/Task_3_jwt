import { NextFunction, Request, Response } from "express";
import { UserRoleEnum } from "../constant/constant";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "./errorHandler.middleware";

interface Permission {
  permission_key: string;
  permission_value: number[];
}

interface User {
  permission?: Permission[];
  userRole?: UserRoleEnum;
  // add other user properties if needed
}

interface UserRequest extends Request {
  user?: User;
}

export const permissionMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  key: string,
  permissionValue: number
) => {
  const user = req.user;
  if (!user) {
    return next(
      new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
    );
  }

  if (user.userRole === UserRoleEnum.rootAdmin) {
    return next();
  }

  if (!user.permission) {
    return next(
      new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
    );
  }

  const permission = user.permission.find(
    (perm) => perm.permission_key === key
  );

  if (!permission || !permission.permission_value.includes(permissionValue)) {
    return next(
      new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
    );
  }
  next();
};
