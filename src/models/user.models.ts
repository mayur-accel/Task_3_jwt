import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { UserRoleEnum } from "../constant/constant";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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

// Hash password before saving the user model
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
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
