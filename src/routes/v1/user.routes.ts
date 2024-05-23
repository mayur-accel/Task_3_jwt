import { NextFunction, Request, Response, Router } from "express";
import { UserRoleEnum } from "../../constant/constant";
import { HTTPStatusCode } from "../../constant/httpStatusCode";
import {
  getActiveUserController,
  getAllUserController,
  getCheckUserRoleController,
  getUserFreeURlControler,
  getUserNormalURlControler,
  getUserProURlControler,
  getUserProfileController,
} from "../../controllers/userControllers.controllers";
import { AppError } from "../../middleware/errorHandler.middleware";
import { asyncWrapper } from "../../utils/asyncWrapper";

const handleUserAuthRole = (
  req: Request,
  res: Response,
  next: NextFunction,
  userRole: UserRoleEnum
) => {
  switch (userRole) {
    case UserRoleEnum.pro: {
      // @ts-ignore
      if (req.user.userRole !== UserRoleEnum.pro) {
        next(
          new AppError(
            HTTPStatusCode.Unauthorized,
            "your not to pro url unauthorized"
          )
        );
      }
      next();

      break;
    }
    case UserRoleEnum.normal: {
      // @ts-ignore
      if (req.user.userRole === UserRoleEnum.free) {
        next(new AppError(HTTPStatusCode.Unauthorized, "Your not authorise"));
      }
      next();
      break;
    }
    default:
      next();
  }
};

const UserRoutes = Router();

UserRoutes.get("/active-device", asyncWrapper(getActiveUserController));

UserRoutes.get("/check-user-role", asyncWrapper(getCheckUserRoleController));

UserRoutes.get("/check-user-role-free", asyncWrapper(getUserFreeURlControler));
UserRoutes.get(
  "/check-user-role-normal",
  (req, res, next) => handleUserAuthRole(req, res, next, UserRoleEnum.normal),
  asyncWrapper(getUserNormalURlControler)
);
UserRoutes.get(
  "/check-user-role-pro",
  (req, res, next) => handleUserAuthRole(req, res, next, UserRoleEnum.pro),
  asyncWrapper(getUserProURlControler)
);

UserRoutes.get("/", asyncWrapper(getAllUserController));

UserRoutes.get("/:userId", asyncWrapper(getUserProfileController));

export default UserRoutes;
