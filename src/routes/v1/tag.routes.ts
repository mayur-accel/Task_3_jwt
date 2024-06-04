import { Router } from "express";
import {
  createTagController,
  deleteTagController,
  getAllTagController,
  updateTagController,
} from "../../controllers/tag.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const TagRoutes = Router();

// create Tag
TagRoutes.post("/", asyncWrapper(createTagController));

// get all Tag redirect
TagRoutes.get("/", asyncWrapper(getAllTagController));

// update Tag
TagRoutes.patch("/:tagId", asyncWrapper(updateTagController));

// delete Tag
TagRoutes.delete("/:tagId", asyncWrapper(deleteTagController));

export default TagRoutes;
