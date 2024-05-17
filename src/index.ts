import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./db/dbConnection";
import { errorHandler } from "./middleware/errorHandler.middleware";
import RootRouter from "./routes/rootRouter.routes";

dotenv.config();
const app = express();

connectDatabase();

app.use(express.json());

app.use("/api/v1", RootRouter);

// Register the error handler middleware
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server start on port", process.env.SERVER_PORT);
});
