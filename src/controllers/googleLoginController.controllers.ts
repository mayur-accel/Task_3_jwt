import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.models";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const client = new OAuth2Client(CLIENT_ID);

const googleLoginController = async (req: Request, res: Response) => {
  const { email, password, idToken } = req.body;
  let user: any;
  try {
    // Check if it's a Google login
    if (req.body.isGoogleLogin) {
      // Google login
      const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
      });

      const payload: any = ticket.getPayload();
      // Check if user exists in MongoDB based on email
      user = await User.findOne({ email: payload.email });

      if (!user) {
        // If user not found, register them
        user = await User.create({ email: payload.email });
      }
    } else {
      // Handle your regular email/password login logic here
      // For example, verify credentials against your database
      res.send("Logged in with email/password.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Login failed");
  }
};
