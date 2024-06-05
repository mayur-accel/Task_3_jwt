import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { Post } from "../models/post.model";
import { Tag } from "../models/tag.model";
import User from "../models/user.models";
import { postCreateSchema } from "../validators/userValidator";

export const createPostController = async (req: Request, res: Response) => {
  const { error } = postCreateSchema.validate(req.body);
  if (error)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: error.details[0].message,
    });

  // Find the user
  const user: any = req.user;
  const userData = await User.findById(user.id);
  if (!userData) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "User not found",
    });
  }

  // Validate tags
  const tagValidationPromises = req.body.tags.map((tagId: string) =>
    Tag.findById(tagId)
  );
  const tagResults = await Promise.all(tagValidationPromises);
  const invalidTags = tagResults.some((tag) => !tag);
  if (invalidTags) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "One or more tags are not found",
    });
  }

  // Create the post
  const body = {
    title: req.body.title,
    description: req.body.description,
    userId: userData.id,
    tags: req.body.tags,
  };

  const postData = new Post(body);
  const result = await postData.save();

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Post created successfully",
    data: result,
  });
};

export const getAllPostController = async (req: Request, res: Response) => {
  const postData = await Post.find({ isDelete: false });

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Post data get sucessfull",
    data: postData,
  });
};

export const getByIdPostController = async (req: Request, res: Response) => {
  const postData = await Post.findById({ _id: req.params.postId });
  if (!postData) {
    return res.json({
      status: 404,
      message: "Post not found",
    });
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Post data get sucessfull",
    data: postData,
  });
};

export const updatePostController = async (req: Request, res: Response) => {
  const postData = await Post.findOneAndUpdate(
    { _id: req.params.postId },
    req.body
  );
  if (!postData) {
    return res.json({
      status: 404,
      message: "Post not found",
    });
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Post data updated sucessfull",
    data: postData,
  });
};

export const deletePostController = async (req: Request, res: Response) => {
  const deleteURL = await Post.findByIdAndDelete({ _id: req.params.postId });
  if (!deleteURL) {
    return res.json({
      status: 404,
      message: "Post not found",
    });
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Post data deleted successfully",
    data: deleteURL,
  });
};
