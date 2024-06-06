import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncWrapper } from "../utils/asyncWrapper";
import AdminRoutes from "./v1/admin/root.routes";
import AuthRoutes from "./v1/auth.routes";
import BookRoutes from "./v1/book.routes";
import FackerRoutes from "./v1/facker.routes";
import OpenRoutes from "./v1/open.routes";
import PostRoutes from "./v1/post.routes";
import TagRoutes from "./v1/tag.routes";
import URLRoutes from "./v1/url.routes";
import UserRoutes from "./v1/user.routes";
import UserActivityRoutes from "./v1/userActivity.routes";

const RootRouter = Router();

// Public routes
RootRouter.use("/auth", AuthRoutes);
RootRouter.use("/open", OpenRoutes);
RootRouter.use("/url", URLRoutes);
RootRouter.use("/facker", FackerRoutes);

// Protected routes
RootRouter.use("/tag", asyncWrapper(authMiddleware), TagRoutes);
RootRouter.use("/user", asyncWrapper(authMiddleware), UserRoutes);
RootRouter.use("/post", asyncWrapper(authMiddleware), PostRoutes);
RootRouter.use("/book", asyncWrapper(authMiddleware), BookRoutes);
RootRouter.use("/admin", asyncWrapper(authMiddleware), AdminRoutes);
RootRouter.use(
  "/user-activity",
  asyncWrapper(authMiddleware),
  UserActivityRoutes
);

export default RootRouter;
