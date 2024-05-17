import { Router } from "express";
import {
  authLoginController,
  authRegisterController,
} from "../../controllers/authController.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const AuthRouter = Router();

AuthRouter.post("/login", asyncWrapper(authLoginController));

AuthRouter.post("/register", asyncWrapper(authRegisterController));

export default AuthRouter;
