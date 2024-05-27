import mongoose from "mongoose";
import { config } from "../config/config";
import { colors } from "../middleware/apiLog.middleware";

const dbURI = config.get("dbURI");

export const connectDatabase = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(
        `${colors.FgGreen}Database connected successfully${colors.Reset}`
      );
    });
    mongoose.connection.on("error", (err) => {
      console.log(`${colors.FgRed}Database connection fail ${colors.Reset}`);
    });
    await mongoose.connect(dbURI);
  } catch (error: any) {
    console.log(
      `${colors.FgRed}Database connection error: ${error.message}${colors.Reset}`
    );
    process.exit(1); // Exit process with failure
  }
};
