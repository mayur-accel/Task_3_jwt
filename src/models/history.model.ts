import mongoose, { Schema } from "mongoose";

const userLogsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    loginTime: {
      type: Date,
      required: true,
    },
    lastActiveTime: {
      type: Date,
      required: true,
    },
    logoutTime: {
      type: Date,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserLogs = mongoose.model("Userlog", userLogsSchema);
