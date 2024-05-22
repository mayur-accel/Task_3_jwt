import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

const keys = process.env.API_KEYS || "";

// Get the API keys from the environment variable and convert them to a set
const validApiKeys = new Set(keys.split(","));

// Middleware to check API key
export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ message: "API key is missing" });
  }
  if (!validApiKeys.has(apiKey)) {
    return res.status(403).json({ message: "Invalid API key" });
  }
  next();
};
