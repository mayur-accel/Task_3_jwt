import { Request, Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { Tag } from "../models/tag.model";
import { tagSchema, tagUpdateSchema } from "../validators/userValidator";

export const createTagController = async (req: Request, res: Response) => {
  const { error } = tagSchema.validate(req.body);
  if (error)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: error.details[0].message,
    });

  const findTagData = await Tag.find({ name: req.body.name });
  if (findTagData.length > 0)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: "Tag is already exits",
    });

  const tagData = new Tag({ name: req.body.name });
  const result = await tagData.save();
  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Tag created sucessfull",
    data: result,
  });
};

export const getAllTagController = async (req: Request, res: Response) => {
  const tagData = await Tag.find({ isDelete: false });

  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Tag data get sucessfull",
    data: tagData,
  });
};

export const updateTagController = async (req: Request, res: Response) => {
  const { error } = tagUpdateSchema.validate(req.body);
  if (error)
    return res.status(HTTPStatusCode.BadRequest).json({
      status: HTTPStatusCode.BadRequest,
      error: error.details[0].message,
    });

  const tagData = await Tag.findOneAndUpdate(
    { _id: req.params.tagId },
    req.body,
    {
      new: true,
    }
  );
  if (!tagData) {
    return res.json({
      status: HTTPStatusCode.NotFound,
      message: "Tag not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Tag data updated sucessfull",
    data: tagData,
  });
};

export const deleteTagController = async (req: Request, res: Response) => {
  const deleteTag = await Tag.findOneAndUpdate(
    { _id: req.params.tagId },
    {
      isDelete: true,
    }
  );
  if (!deleteTag) {
    return res.json({
      status: HTTPStatusCode.NotFound,
      message: "Tag not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Tag data deleted successfully",
    data: deleteTag,
  });
};
