import { Router } from "express";
import { UserRoleEnum } from "../../../constant/constant";
import { HTTPStatusCode } from "../../../constant/httpStatusCode";
import { AppError } from "../../../middleware/errorHandler.middleware";
import AdminUserRoute from "./adminUser.routes";
import SubAdminRoutes from "./subAdmin.routes";

const AdminRoutes = Router();

AdminRoutes.use(
  "/subadmin",
  (req, res, next) => {
    const user: any = req.user;
    if (!user || user.userRole !== UserRoleEnum.rootAdmin) {
      return next(
        new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
      );
    }
    next();
  },
  SubAdminRoutes
);

AdminRoutes.use(
  "/user",
  (req, res, next) => {
    const user: any = req.user;
    if (
      !user ||
      user.userRole === UserRoleEnum.free ||
      user.userRole === UserRoleEnum.normal ||
      user.userRole === UserRoleEnum.pro
    ) {
      return next(
        new AppError(HTTPStatusCode.BadRequest, "You are not authorized")
      );
    }
    next();
  },
  AdminUserRoute
);

export default AdminRoutes;
