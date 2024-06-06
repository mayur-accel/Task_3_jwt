import { Request, Response } from "express";
import mongoose from "mongoose";
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

  let tagIdValidation = false;
  req.body.tags.map((tagId: string) => {
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      tagIdValidation = true;
    }
  });
  if (tagIdValidation) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "One or more tags please provide a id ",
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
  const user: any = req.user;
  const postData = await Post.find({ isDelete: false, userId: user.id })
    .populate("tags")
    .populate("userId");

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Post data get sucessfull",
    data: postData,
  });
};

export const getAllUserPostController = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const startIndex = (page - 1) * limit;

  const filter: any = {
    isDelete: false,
    isActive: true,
  };

  if (req.query?.tags) {
    filter.tags = {
      $in: String(req.query.tags)
        .split(",")
        .map((tag: string) => new mongoose.Types.ObjectId(tag.trim())),
    };
  }
  if (req.query?.title) {
    filter.title = {
      $regex: req.query?.title,
      $options: "i",
    };
  }

  if (req.query.user) {
    filter.userId = new mongoose.Types.ObjectId(String(req.query.user || ""));
  }

  const results = await Post.aggregate([
    { $match: filter },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "tags",
        foreignField: "_id",
        localField: "tags",
        as: "tag",
      },
    },
    { $skip: startIndex },
    { $limit: limit },
    {
      $facet: {
        posts: [
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              user_details: {
                _id: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
              },
              tag: {
                _id: 1,
                name: 1,
              },
            },
          },
        ],
      },
    },
  ]);

  const totalCount = await Post.countDocuments(filter);

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Post data get sucessfull",
    totalCount,
    data: results[0].posts,
  });
};

export const getByIdPostController = async (req: Request, res: Response) => {
  // Validate the postId parameter
  const { postId } = req.params;
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Invalid post ID",
    });
  }

  // Find the post by ID
  const postData = await Post.findById(postId)
    .populate("tags")
    .populate("userId");

  if (!postData) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "Post not found",
    });
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Post data retrieved successfully",
    data: postData,
  });
};

export const updatePostController = async (req: Request, res: Response) => {
  // Validate the postId parameter
  const { postId } = req.params;
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Invalid post ID",
    });
  }

  const postData = await Post.findOneAndUpdate(
    { _id: req.params.postId },
    req.body,
    {
      new: true,
    }
  );

  if (!postData) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
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
  // Validate the postId parameter
  const { postId } = req.params;
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      message: "Invalid post ID",
    });
  }

  const deletePost = await Post.findOneAndUpdate(
    { _id: req.params.postId },
    {
      isDelete: true,
    },
    {
      new: true,
    }
  );
  if (!deletePost) {
    return res.status(HTTPStatusCode.NotFound).json({
      status: HTTPStatusCode.NotFound,
      message: "Post not found",
    });
  }

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Post data deleted successfully",
    data: deletePost,
  });
};






