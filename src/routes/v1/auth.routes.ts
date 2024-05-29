import { Router } from "express";
import {
  authForgotPasswordController,
  authLoginController,
  authLogoutController,
  authRegisterController,
  authResetPasswordController,
  authSetPasswordController,
  googleLoginController,
} from "../../controllers/authController.controllers";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncWrapper } from "../../utils/asyncWrapper";

const AuthRoutes = Router();

AuthRoutes.post("/login", asyncWrapper(authLoginController));

AuthRoutes.post("/google/login", asyncWrapper(googleLoginController));

AuthRoutes.post("/register", asyncWrapper(authRegisterController));

AuthRoutes.post("/set-password", asyncWrapper(authSetPasswordController));

AuthRoutes.post(
  "/reset-password",
  asyncWrapper(authMiddleware),
  asyncWrapper(authResetPasswordController)
);

AuthRoutes.post("/forgot-password", asyncWrapper(authForgotPasswordController));

AuthRoutes.post(
  "/logout",
  asyncWrapper(authMiddleware),
  asyncWrapper(authLogoutController)
);

export default AuthRoutes;
