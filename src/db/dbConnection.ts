import mongoose from "mongoose";
import { config } from "../config/config";
import { colors } from "../middleware/apiLog.middleware";

const dbURI = config.get("dbURI");

export const connectDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(
      `${colors.FgGreen}Database connected successfully${colors.Reset}`
    );
  } catch (error: any) {
    console.log(
      `${colors.FgRed}Database connection error: ${error.message}${colors.Reset}`
    );
    process.exit(1); // Exit process with failure
  }
};
