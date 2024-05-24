import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { JWTexpiresIn } from "../constant/constant";

interface Payload {
  [key: string]: any;
}

export const generateJWTToken = async (payload: Payload) => {
  try {
    const secretKey = config.get("secretKey");
    if (!secretKey) {
      console.error("Secret key not defined");
    }

    const token = jwt.sign(payload, secretKey, {
      expiresIn: JWTexpiresIn,
    });

    return token;
  } catch (err) {
    console.error("Error generating JWT:", err);
  }
};
