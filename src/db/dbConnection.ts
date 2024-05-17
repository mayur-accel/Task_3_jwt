import mongoose from "mongoose";

const dbURI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test_jwt";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Database connected successfully");
  } catch (error: any) {
    console.log(`Database connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
