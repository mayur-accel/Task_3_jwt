import mongoose from "mongoose";
import { colors } from "../middleware/apiLog.middleware";

const dbURI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test_jwt";

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
