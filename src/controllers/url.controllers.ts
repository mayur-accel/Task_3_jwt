import { Request, Response } from "express";
import shortid from "shortid";
import { HTTPStatusCode } from "../constant/httpStatusCode";
import { URL } from "../models/url.model";
import User from "../models/user.models";

export const createUrlController = async (req: Request, res: Response) => {
  const userData = await User.findById({ _id: req.body.userId });

  if (!userData) {
    return res.json({
      message: "user nout found",
    });
  }
  const title = shortid();
  const body = {
    ...req.body,
    title: title,
  };

  const urlData = new URL(body);

  const result = await urlData.save();

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "cerateUrlcontroler",
    data: result,
  });
};

export const getAllURLController = async (req: Request, res: Response) => {
  const urlData = await URL.find({});

  return res.status(HTTPStatusCode.Created).json({
    status: HTTPStatusCode.Created,
    message: "Url data get sucessfull",
    data: urlData,
  });
};

export const getByIdURLController = async (req: Request, res: Response) => {
  const urlData = await URL.findById({ _id: req.params.urlId });
  if (!urlData) {
    return res.json({
      status: 404,
      message: "Url not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Url data get sucessfull",
    data: urlData,
  });
};

export const urlRedirectController = async (req: Request, res: Response) => {
  const urlData = await URL.findOne({ title: req.params.urlId });
  if (!urlData) {
    return res.json({
      status: 404,
      message: "Url not found",
    });
  }

  return res.redirect(urlData.redirectUrl);
};

export const updateURLController = async (req: Request, res: Response) => {
  const urlData = await URL.findOneAndUpdate(
    { _id: req.params.urlId },
    req.body
  );
  if (!urlData) {
    return res.json({
      status: 404,
      message: "Url not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Url data updated sucessfull",
    data: urlData,
  });
};

export const deleteURLController = async (req: Request, res: Response) => {
  const deleteURl = await URL.findByIdAndDelete({ _id: req.params.urlId });
  if (!deleteURl) {
    return res.json({
      status: 404,
      message: "Url not found",
    });
  }
  return res.status(HTTPStatusCode.Ok).json({
    status: HTTPStatusCode.Ok,
    message: "Url data deleted sucessfull",
    data: deleteURl,
  });
};
