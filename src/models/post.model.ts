import mongoose, { Schema } from "mongoose";

// Define the interface for the Post document
interface IPost extends Document {
  title: string;
  description: string;
  isActive: boolean;
  isDelete: boolean;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
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

// Create and export the Post model
export const Post = mongoose.model<IPost>("Post", postSchema);
