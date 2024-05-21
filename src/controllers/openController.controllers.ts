import { Request, Response } from "express";

export const getOpenController = (req: Request, res: Response) => {
  return res.json({
    message: "Open api",
  });
};
