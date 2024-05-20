import { Router } from "express";
import {
  authForgotPasswordController,
  authLoginController,
  authLogoutController,
  authRegisterController,
  authResetPasswordController,
  authSetPasswordController,
} from "../../controllers/authController.controllers";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncWrapper } from "../../utils/asyncWrapper";

const AuthRouter = Router();

AuthRouter.post("/login", asyncWrapper(authLoginController));

AuthRouter.post("/register", asyncWrapper(authRegisterController));

AuthRouter.post("/set-password", asyncWrapper(authSetPasswordController));

AuthRouter.post(
  "/reset-password",
  asyncWrapper(authMiddleware),
  asyncWrapper(authResetPasswordController)
);

AuthRouter.post("/forgot-password", asyncWrapper(authForgotPasswordController));

AuthRouter.post("/logout", asyncWrapper(authLogoutController));

export default AuthRouter;
