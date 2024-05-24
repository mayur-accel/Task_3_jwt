import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";
import AdminRoutes from "./v1/admin/root.routes";
import AuthRoutes from "./v1/auth.routes";
import OpenRoutes from "./v1/open.routes";
import URLRoutes from "./v1/url.routes";
import UserRoutes from "./v1/user.routes";

const RootRouter = Router();

// Public routes
RootRouter.use("/auth", AuthRoutes);
RootRouter.use("/open", OpenRoutes);
RootRouter.use("/url", URLRoutes);

// Protected routes
RootRouter.use("/user", asyncWrapper(authMiddleware), UserRoutes);
RootRouter.use("/admin", asyncWrapper(authMiddleware), AdminRoutes);

export default RootRouter;
