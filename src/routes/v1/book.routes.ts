import { Router } from "express";
import {
  createBookController,
  deleteBookController,
  getAllBookController,
  getAllBookIdController,
  getBookTagDataController,
  insertBookController,
  insertBookTagController,
  updateBookController,
} from "../../controllers/book.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const BookRoutes = Router();

// create Book
BookRoutes.post("/insert", asyncWrapper(insertBookController));

BookRoutes.post("/book-tag-insert", asyncWrapper(insertBookTagController));

BookRoutes.get("/book-tag/get", asyncWrapper(getBookTagDataController));

BookRoutes.post("/get_id", asyncWrapper(getAllBookIdController));

BookRoutes.post("/", asyncWrapper(createBookController));

// get all Book redirect
BookRoutes.get("/", asyncWrapper(getAllBookController));

// update Book
BookRoutes.patch("/:bookId", asyncWrapper(updateBookController));

// delete Book
BookRoutes.delete("/:bookId", asyncWrapper(deleteBookController));

export default BookRoutes;
