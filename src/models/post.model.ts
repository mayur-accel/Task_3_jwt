import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      require: true,
      default: true,
    },
    isDelete: {
      type: Boolean,
      require: true,
      default: false,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        requried: true,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
