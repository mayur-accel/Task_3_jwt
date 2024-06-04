import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isDelete: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", tagSchema);
