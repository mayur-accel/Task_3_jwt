import mongoose, { Schema } from "mongoose";

const userActivitySchema = new Schema(
  {
    method: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    statusMessage: {
      type: String,
      required: true,
    },
    jwtToken: {
      type: String,
      required: true,
    },
    responseTime: {
      type: String,
      required: true,
    },
    params: {
      type: String,
      default: "",
    },
    query: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: true,
    },
  },
  { timestamps: true }
);

export const UserActivity = mongoose.model("Useractivity", userActivitySchema);
