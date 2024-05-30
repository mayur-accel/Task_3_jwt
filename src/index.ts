import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { config } from "./config/config";
import { connectDatabase } from "./db/dbConnection";
import { apiLogMiddleware } from "./middleware/apiLog.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import "./middleware/googleAuth.middleware";
import RootRouter from "./routes/rootRouter.routes";

dotenv.config();
const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Apply the middleware globally (all routes are protected)
// app.use(checkApiKey);

app.use(apiLogMiddleware);

app.use("/api/v1", RootRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

// Register the error handler middleware
app.use(errorHandler);

app.listen(config.get("serverPort"), () => {
  console.log("Server start on port", config.get("serverPort"));
});
