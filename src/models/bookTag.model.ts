import mongoose, { Schema } from "mongoose";

// Define the interface for the Book document
interface IBookTag extends Document {
  bookId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBookTag>(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      requried: true,
    },
    tagId: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        requried: true,
      },
  },
  { timestamps: true }
);

export const BookTag = mongoose.model<IBookTag>("BookTag", bookSchema);
