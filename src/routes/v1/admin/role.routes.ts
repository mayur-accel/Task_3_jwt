import { Router } from "express";
import { PermissionEnum } from "../../../constant/constant";
import {
  createAdminRoleController,
  deleteAdminRoleController,
  getAllAdminRoleController,
  updateAdminRoleController,
} from "../../../controllers/admin/adminRole.controller";
import permissionMiddleware from "../../../middleware/permission.middleware";
import { asyncWrapper } from "../../../utils/asyncWrapper";

const AdminRoleRoutes = Router();

AdminRoleRoutes.post(
  "/",
  permissionMiddleware("adminrole", PermissionEnum.create),
  asyncWrapper(createAdminRoleController)
);

AdminRoleRoutes.get(
  "/",
  permissionMiddleware("adminrole", PermissionEnum.read),
  asyncWrapper(getAllAdminRoleController)
);

AdminRoleRoutes.patch(
  "/:adminRoleId",
  permissionMiddleware("adminrole", PermissionEnum.update),
  asyncWrapper(updateAdminRoleController)
);

AdminRoleRoutes.delete(
  "/:adminRoleId",
  permissionMiddleware("adminrole", PermissionEnum.delete),
  asyncWrapper(deleteAdminRoleController)
);

export default AdminRoleRoutes;
