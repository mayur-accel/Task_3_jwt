import { NextFunction, Request, Response } from "express";
import { PermissionEnum, UserRoleEnum } from "../constant/constant";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "./errorHandler.middleware";

interface Permission {
  permission_key: string;
  permission_value: number[];
}

interface User {
  permission?: Permission[];
  userRole?: UserRoleEnum;
}

interface UserRequest extends Request {
  user?: User;
}

function permissionMiddleware(
  resourceType: string,
  requiredPermission: PermissionEnum
) {
  return function (req: UserRequest, res: Response, next: NextFunction) {
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
      (perm) => perm.permission_key === resourceType
    );

    if (
      !permission ||
      !permission.permission_value.includes(requiredPermission)
    ) {
      return next(
        new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
      );
    }
    next();
  };
}

export default permissionMiddleware;
