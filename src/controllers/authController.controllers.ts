import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "../middleware/errorHandler.middleware";
import User from "../models/user.models";
import { generateJWTToken } from "../utils/jwtToken";

export const authLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    throw new AppError(
      HTTPStatusCode.BadRequest,
      "Email and password are required"
    );
  }

  const userData = await User.findOne({ email });

  if (!userData || !bcrypt.compareSync(password, userData.password)) {
    throw new AppError(HTTPStatusCode.Unauthorized, "Invalid credentials");
  }

  const passUserData = {
    id: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  };

  const jwtToken = await generateJWTToken(passUserData);

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User login successful",
    data: {
      ...passUserData,
      token: jwtToken,
    },
  });
};

export const authRegisterController = async (req: Request, res: Response) => {
  let userData: any = await User.findOne({ email: req.body.email });
  if (userData) {
    throw new AppError(HTTPStatusCode.BadRequest, "Email is aleady register");
  }

  const registerData = new User(req.body);

  userData = await registerData.save();

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "User  register sucessfull",
    data: userData,
  });
};
