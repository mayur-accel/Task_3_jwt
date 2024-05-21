import { Router } from "express";
import { getOpenController } from "../../controllers/openController.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const OpenRouter = Router();

OpenRouter.get("/", asyncWrapper(getOpenController));

export default OpenRouter;
