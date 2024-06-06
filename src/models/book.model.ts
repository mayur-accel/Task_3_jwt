import mongoose, { Schema } from "mongoose";

// Define the interface for the Book document
interface IBook extends Document {
  name: string;
  description: string;
  isActive: boolean;
  isDelete: boolean;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    name: {
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requried: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>("Book", bookSchema);
