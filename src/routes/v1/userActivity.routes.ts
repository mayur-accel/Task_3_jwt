import { Router } from "express";
import { getUserActivityController } from "../../controllers/userActivity.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";

const UserActivityRoutes = Router();

UserActivityRoutes.get("/", asyncWrapper(getUserActivityController));

export default UserActivityRoutes;
