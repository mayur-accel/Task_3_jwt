import dotenv from "dotenv";
dotenv.config();

const _config: any = {
  apiKey: process.env.API_KEYS || "",
  serverPort: process.env.SERVER_PORT || 3000,
  dbURI: process.env.MONGO_URI || "",
  secretKey: process.env.SECRET_KEY || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};

export const config = {
  get(key: string) {
    const value = _config[key];
    if (!value) {
      console.error("env variable not nount");
      process.exit();
    }
    return value;
  },
};
