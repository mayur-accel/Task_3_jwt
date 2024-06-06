import { faker } from "@faker-js/faker";
import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { BookIdArray, TagIdArray, UserIdArray } from "../constant/userId";
import { Book } from "../models/book.model";
import { BookTag } from "../models/bookTag.model";
import {
  bookCreateSchema,
  bookUpdateSchema,
} from "../validators/userValidator";

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export const getAllBookIdController = async (req: Request, res: Response) => {
  const mainresult = await Book.find({});
  const result = mainresult.map((item) => item._id);

  return res.json({
    message: "book id get",
    data: result,
  });
};

export const insertBookTagController = async (req: Request, res: Response) => {
  const result = [];
  for (let index = 0; index < 10000; index++) {
    const book = {
      bookId: BookIdArray[getRandomInt(BookIdArray.length)],
      tagId: TagIdArray[getRandomInt(TagIdArray.length)],
    };
    result.push(book);
  }

  const mainresult = await BookTag.insertMany(result);

  return res.json({
    message: "Insert many data",
    data: mainresult,
  });
};

export const getBookTagDataController = async (req: Request, res: Response) => {
  const result = await Book.aggregate([
    {
      $lookup: {
        as: "tags",
        from: "booktags",
        foreignField: "bookId",
        localField: "_id",
      },
    },
    {
      $lookup: {
        as: "tags_details",
        from: "tags",
        foreignField: "_id",
        localField: "tags.tagId",
      },
    },
    {
      $match: {
        "tags_details.name": "reactjs",
      },
    },
  ]);

  return res.json({
    message: "book tag data",
    data: result,
  });
};

export const insertBookController = async (req: Request, res: Response) => {
  const result = [];
  for (let index = 0; index < 10000; index++) {
    const book = {
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      userId: UserIdArray[getRandomInt(1000)],
    };
    result.push(book);
  }
  const mainresult: any = await Book.insertMany(result);

  return res.json({
    message: "Insert many data",
    data: mainresult,
  });
};

export const createBookController = async (req: Request, res: Response) => {
  const { error } = bookCreateSchema.validate(req.body);
  if (error)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: error.details[0].message,
    });

  const findBookData = await Book.find({ name: req.body.name });
  if (findBookData.length > 0)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: "Book is already exits",
    });

  const BookData = new Book({ name: req.body.name });
  const result = await BookData.save();
  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Book created sucessfull",
    data: result,
  });
};

export const getAllBookController = async (req: Request, res: Response) => {
  const BookData = await Book.find({ isDelete: false });

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Book data get sucessfull",
    data: BookData,
  });
};

export const updateBookController = async (req: Request, res: Response) => {
  const { error } = bookUpdateSchema.validate(req.body);
  if (error)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: error.details[0].message,
    });

  const BookData = await Book.findOneAndUpdate(
    { _id: req.params.BookId },
    req.body,
    {
      new: true,
    }
  );
  if (!BookData) {
    return res.json({
      status: HTTPStatusCode.NotFound,
      message: "Book not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Book data updated sucessfull",
    data: BookData,
  });
};

export const deleteBookController = async (req: Request, res: Response) => {
  const deleteBook = await Book.findOneAndUpdate(
    { _id: req.params.BookId },
    {
      isDelete: true,
    }
  );
  if (!deleteBook) {
    return res.json({
      status: HTTPStatusCode.NotFound,
      message: "Book not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Book data deleted successfully",
    data: deleteBook,
  });
};
