import { Router } from "express";
import {
  createSubAdminController,
  deleteSubAdminController,
  getAllSubAdminController,
  updateSubAdminController,
} from "../../../controllers/admin/subAdmin.controller";
import { asyncWrapper } from "../../../utils/asyncWrapper";

const SubAdminRoutes = Router();

SubAdminRoutes.post("/", asyncWrapper(createSubAdminController));

SubAdminRoutes.get("/", asyncWrapper(getAllSubAdminController));

SubAdminRoutes.patch("/:subadminId", asyncWrapper(updateSubAdminController));

SubAdminRoutes.delete("/:subadminId", asyncWrapper(deleteSubAdminController));

export default SubAdminRoutes;
