import jwt from "jsonwebtoken";
import { JWTexpiresIn } from "../constant/constant";

interface Payload {
  [key: string]: any;
}

export const generateJWTToken = async (payload: Payload) => {
  try {
    const secretKey = process.env.SECRET_KEY || "";
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
