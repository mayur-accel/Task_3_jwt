import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPostController,
  getAllUserPostController,
  getByIdPostController,
  updatePostController,
} from "../../controllers/post.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const PostRoutes = Router();

// create Post
PostRoutes.post("/", asyncWrapper(createPostController));

// get all Post
PostRoutes.get("/", asyncWrapper(getAllPostController));

// get all User Post
PostRoutes.get("/user", asyncWrapper(getAllUserPostController));

// get by Id Post
PostRoutes.get("/:postId", asyncWrapper(getByIdPostController));

// update Post
PostRoutes.patch("/:postId", asyncWrapper(updatePostController));

// delete Post
PostRoutes.delete("/:postId", asyncWrapper(deletePostController));

export default PostRoutes;
