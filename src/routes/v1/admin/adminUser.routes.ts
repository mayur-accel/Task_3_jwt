import { Router } from "express";
import { UserPermissionEnum } from "../../../constant/constant";
import { permissionMiddleware } from "../../../middleware/permission.middleware";

const AdminUserRoute = Router();

AdminUserRoute.post(
  "/",
  (req, res, next) =>
    permissionMiddleware(req, res, next, "user", UserPermissionEnum.create),
  (req, res) => {
    return res.json({
      message: "i am admin user routes create",
    });
  }
);

AdminUserRoute.get(
  "/",
  (req, res, next) =>
    permissionMiddleware(req, res, next, "user", UserPermissionEnum.read),
  (req, res) => {
    return res.json({
      message: "i am admin user routes read",
    });
  }
);

AdminUserRoute.patch(
  "/",
  (req, res, next) =>
    permissionMiddleware(req, res, next, "user", UserPermissionEnum.update),
  (req, res) => {
    return res.json({
      message: "i am admin user routes update",
    });
  }
);

AdminUserRoute.delete(
  "/",
  (req, res, next) =>
    permissionMiddleware(req, res, next, "user", UserPermissionEnum.delete),
  (req, res) => {
    return res.json({
      message: "i am admin user routes delete",
    });
  }
);

export default AdminUserRoute;
