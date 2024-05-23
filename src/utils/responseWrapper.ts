import { Response } from "express";
import { HTTPStatusCode } from "../constant/httpStatusCode";

interface ResponseData {
  statusCode: HTTPStatusCode;
  message: string;
  data?: any;
}

export const ResponseWrapper = (
  res: Response,
  { statusCode, message, data }: ResponseData
) => {
  const responsePayload: any = {
    status: statusCode,
    message,
  };

  if (data !== undefined) {
    responsePayload.data = data;
  }

  return res.status(statusCode).json(responsePayload);
};
