import { NextFunction, Request, Response, Router } from "express";
import { UserRoleEnum } from "../../../constant/constant";
import { HTTPStatusCode } from "../../../constant/httpStatusCode";
import { AppError } from "../../../middleware/errorHandler.middleware";
import AdminRoleRoutes from "./role.routes";
import AdminUserRoutes from "./user.routes";

const AdminRoutes = Router();

// Middleware to check if the user is an admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;
  if (
    !user ||
    user.userRole === UserRoleEnum.free ||
    user.userRole === UserRoleEnum.normal ||
    user.userRole === UserRoleEnum.pro
  ) {
    return next(
      new AppError(HTTPStatusCode.Unauthorized, "You are not authorized")
    );
  }
  next();
};

AdminRoutes.use("/user", isAdmin, AdminUserRoutes);
AdminRoutes.use("/role", AdminRoleRoutes);

export default AdminRoutes;
