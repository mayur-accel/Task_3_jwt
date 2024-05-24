import { Router } from "express";
import { PermissionEnum } from "../../../constant/constant";
import {
  createAdminUserController,
  deleteAdminUserController,
  getAllAdminUserController,
  updateAdminUserController,
} from "../../../controllers/admin/adminUser.controller";
import permissionMiddleware from "../../../middleware/permission.middleware";
import { asyncWrapper } from "../../../utils/asyncWrapper";

const AdminUserRoutes = Router();

AdminUserRoutes.post(
  "/",
  permissionMiddleware("user", PermissionEnum.create),
  asyncWrapper(createAdminUserController)
);

AdminUserRoutes.get(
  "/",
  permissionMiddleware("user", PermissionEnum.read),
  asyncWrapper(getAllAdminUserController)
);

AdminUserRoutes.patch(
  "/:adminUserId",
  permissionMiddleware("user", PermissionEnum.update),
  asyncWrapper(updateAdminUserController)
);

AdminUserRoutes.delete(
  "/:adminUserId",
  permissionMiddleware("user", PermissionEnum.delete),
  asyncWrapper(deleteAdminUserController)
);

export default AdminUserRoutes;
