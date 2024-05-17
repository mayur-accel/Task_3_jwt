import { Router } from "express";
import { getAllUserController } from "../../controllers/userControllers.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const UserRouters = Router();

UserRouters.get("/", asyncWrapper(getAllUserController));

export default UserRouters;
