import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { UserRoleEnum } from "../constant/constant";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    googleId: {
      type: String,
      default: "",
    },
    userRole: {
      type: Number,
      default: UserRoleEnum.free,
      required: true,
    },
    adminRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adminrole",
    },
    permission: [
      {
        permission_key: {
          type: String,
          required: true,
        },
        permission_value: {
          type: [Number],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password if it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});
userSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();

  if (update && update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (err: any) {
      return next(err);
    }
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
