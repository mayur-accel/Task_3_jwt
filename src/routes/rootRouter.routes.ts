import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";
import AuthRouter from "./v1/auth.routes";
import OpenRouter from "./v1/open.routes";
import UserRouters from "./v1/user.routes";

const RootRouter = Router();

RootRouter.use("/auth", AuthRouter);

RootRouter.use("/user", asyncWrapper(authMiddleware), UserRouters);

RootRouter.use("/open", OpenRouter);

export default RootRouter;
