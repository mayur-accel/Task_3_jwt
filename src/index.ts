import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import helmet from "helmet";
import { createServer } from "http";
import passport from "passport";
import { Server } from "socket.io";
import { config } from "./config/config";
import { HTTPStatusCode } from "./constant/httpStatusCode";
import { connectDatabase } from "./db/dbConnection";
import { apiLogMiddleware } from "./middleware/apiLog.middleware";
import { AppError, errorHandler } from "./middleware/errorHandler.middleware";
import "./middleware/googleAuth.middleware";
import RootRouter from "./routes/rootRouter.routes";

dotenv.config();
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connection successfull");
  console.log("User id:", socket.id);

  socket.on("send-message", (message) => {
    console.log(message);
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Use is disconnect", socket.id);
  });
});

connectDatabase();

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new AppError(HTTPStatusCode.NotFound, "API not found");
  return next(err);
});

// Register the error handler middleware
app.use(errorHandler);

server.listen(config.get("serverPort"), () => {
  console.log("Server start on port", config.get("serverPort"));
});
