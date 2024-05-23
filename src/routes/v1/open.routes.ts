import { Router } from "express";
import { getOpenController } from "../../controllers/openController.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const OpenRoutes = Router();

OpenRoutes.get("/", asyncWrapper(getOpenController));

export default OpenRoutes;
