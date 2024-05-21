import { Router } from "express";
import {
  getActiveUserController,
  getAllUserController,
  getCheckUserRoleController,
  getUserFreeURlControler,
  getUserNormalURlControler,
  getUserProURlControler,
  getUserProfileController,
} from "../../controllers/userControllers.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const UserRouters = Router();

UserRouters.get("/active-device", asyncWrapper(getActiveUserController));

UserRouters.get("/check-user-role", asyncWrapper(getCheckUserRoleController));

UserRouters.get("/check-user-role-free", asyncWrapper(getUserFreeURlControler));
UserRouters.get(
  "/check-user-role-normal",
  asyncWrapper(getUserNormalURlControler)
);
UserRouters.get("/check-user-role-pro", asyncWrapper(getUserProURlControler));

UserRouters.get("/", asyncWrapper(getAllUserController));

UserRouters.get("/:userId", asyncWrapper(getUserProfileController));

export default UserRouters;
