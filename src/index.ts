import dotenv from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { connectDatabase } from "./db/dbConnection";
import { apiLogMiddleware } from "./middleware/apiLog.middleware";
import { checkApiKey } from "./middleware/checkApiKey.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import "./middleware/googleAuth.middleware";
import RootRouter from "./routes/rootRouter.routes";

dotenv.config();
const app = express();

connectDatabase();

app.use(express.json());
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
app.use(checkApiKey);

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

app.get("/auth/logout", async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
});

// Register the error handler middleware
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server start on port", process.env.SERVER_PORT);
});
