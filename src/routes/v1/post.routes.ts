import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPostController,
  getByIdPostController,
  updatePostController,
} from "../../controllers/post.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const PostRoutes = Router();

// create Post
PostRoutes.post("/", asyncWrapper(createPostController));

// get all Post redirect
PostRoutes.get("/", asyncWrapper(getAllPostController));

// get by Post
PostRoutes.get("/:postId", asyncWrapper(getByIdPostController));

// update Post
PostRoutes.patch("/:postId", asyncWrapper(updatePostController));

// delete Post
PostRoutes.delete("/:postId", asyncWrapper(deletePostController));

export default PostRoutes;
