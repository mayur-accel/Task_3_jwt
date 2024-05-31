import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import { UserRoleEnum } from "../constant/constant";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { AppError } from "../middleware/errorHandler.middleware";
import { UserLogs } from "../models/history.model";
import User from "../models/user.models";
import { generateJWTToken } from "../utils/jwtToken";
import userRegisterSchema from "../validators/userValidator";

export const authLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    throw new AppError(
      HTTPStatusCode.BadRequest,
      "Email and password are required"
    );
  }

  const userData = await User.findOne({ email: email });

  if (!userData || !bcrypt.compareSync(password, userData.password)) {
    throw new AppError(HTTPStatusCode.Unauthorized, "Invalid credentials");
  }

  const passUserData: any = {
    id: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    userRole: userData.userRole || UserRoleEnum.free,
  };

  if (req.body.isAdmin === true) {
    passUserData.permission = userData.permission;
  }

  const jwtToken = await generateJWTToken(passUserData);

  const currentTime = new Date();
  const data = new UserLogs({
    userId: userData._id,
    isActive: true,
    lastActiveTime: currentTime,
    loginTime: currentTime,
    logoutTime: "",
    token: jwtToken,
  });

  data.save();

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
  const { error } = userRegisterSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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

export const authSetPasswordController = async (
  req: Request,
  res: Response
) => {
  const token = req.body.resetToken;
  const secretKey = config.get("secretKey");

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!password && !confirmPassword) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Password and confirmPassword field are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Password and confirmPassword field are not same",
    });
  }

  // Verify the token
  const decoded = jwt.verify(token, secretKey) as JwtPayload;

  if (!decoded) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Reset token is not valid",
    });
  }

  const userData = await User.find({ _id: decoded.id });

  if (!userData) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "User not Found",
    });
  }

  await User.findOneAndUpdate(
    { _id: decoded.id },
    {
      password: password,
    }
  );

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "your password sucessfull set",
  });
};

export const authResetPasswordController = async (
  req: Request,
  res: Response
) => {
  const email = req.query.email;
  if (!email) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Email fields required",
    });
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword && !newPassword && !confirmPassword) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message:
        "OldPassword, newPassword and confirm Passsword are fields required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "NewPassword and confirm Passsword required same",
    });
  }

  if (newPassword === oldPassword) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "NewPassword and old Passsword not required same",
    });
  }

  const userData = await User.findOne({ email: email });

  if (!userData || !bcrypt.compareSync(oldPassword, userData.password)) {
    throw new AppError(HTTPStatusCode.Unauthorized, "Invalid credentials");
  }

  await User.findOneAndUpdate(
    { _id: userData._id },
    {
      password: newPassword,
    }
  );

  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const user: any = req.user;

  await UserLogs.findOneAndUpdate(
    {
      userId: user.id,
      token: token,
    },
    {
      lastActiveTime: new Date(),
      logoutTime: new Date(),
      isActive: false,
    }
  );

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User password sucessfull reset",
  });
};

export const authForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  const email = req.body.email;
  if (!email) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Email is required",
    });
  }

  const userData = await User.findOne({ email: email });
  if (!userData) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "User with this email does not exist",
    });
  }

  const passUserData = {
    id: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  };
  const secretKey = config.get("secretKey");
  if (!secretKey) {
    console.error("Secret key not defined");
    throw new AppError(
      HTTPStatusCode.InternalServerError,
      "Internal server error"
    );
  }

  const token = jwt.sign(passUserData, secretKey, { expiresIn: "15m" });
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Password reset link has been sent to your email",
    // Remove this line in a real application
    resetToken: token,
  });
};

export const authLogoutController = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const user: any = req.user;

  if (!user) {
    return res.status(HTTPStatusCode.Ok).json({
      status: HTTPStatusCode.Ok,
      message: "User logout sucessfull",
    });
  }

  await UserLogs.findOneAndUpdate(
    {
      userId: user.id,
      token: token,
    },
    {
      lastActiveTime: new Date(),
      logoutTime: new Date(),
      isActive: false,
    }
  );

  //  google logout function
  req.logout((err) => {
    if (err) console.log(err);
  });

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User logout sucessfull",
  });
};

const logUserActivity = async (userId: string, jwtToken: string) => {
  const currentTime = new Date();
  const data = new UserLogs({
    userId,
    isActive: true,
    lastActiveTime: currentTime,
    loginTime: currentTime,
    logoutTime: "",
    token: jwtToken,
  });

  await data.save();
};

export const googleLoginController = async (req: Request, res: Response) => {
  const body = req.body;

  if (!body) {
    throw new AppError(HTTPStatusCode.BadRequest, "Request is empty");
  }

  const userData: any = await User.findOne({ email: body.email });

  let passUserData: any;
  if (!userData) {
    const userSaveData = new User(body);
    const result = await userSaveData.save();
    passUserData = {
      id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      userRole: result.userRole,
    };
  } else {
    const updateData: any = {};

    if (body.googleId && !userData.googleId) {
      updateData.googleId = body.googleId;
    }

    if (body.githubId && !userData.githubId) {
      updateData.githubId = body.githubId;
    }
    if (body.twitterId && !userData.twitterId) {
      updateData.twitterId = body.twitterId;
    }
    if (body.facebookId && !userData.facebookId) {
      updateData.facebookId = body.facebookId;
    }

    if (Object.keys(updateData).length !== 0) {
      await User.findOneAndUpdate({ email: body.email }, updateData);
    }

    passUserData = {
      id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userRole: userData.userRole,
    };
  }

  const jwtToken: any = await generateJWTToken(passUserData);

  logUserActivity(passUserData.id, jwtToken);

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "User login successful",
    data: {
      ...passUserData,
      token: jwtToken,
    },
  });
};
