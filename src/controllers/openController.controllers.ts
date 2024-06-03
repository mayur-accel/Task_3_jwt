import { faker } from "@faker-js/faker";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import qrcode from "qrcode";
import { UserRoleEnum } from "../constant/constant";
import User from "../models/user.models";

export const getOpenController = (req: Request, res: Response) => {
  return res.json({
    message: "Open api",
  });
};

export const qrcodeGenarator = async (req: Request, res: Response) => {
  const { text }: any = req.query;

  if (!text) {
    return res.status(400).json({ error: "Text query parameter is required" });
  }

  const qr = await qrcode.toDataURL(text);
  return res.send(`<img src=${qr} alt='qr'></img>`);
};

export const multipleFilter = async (req: Request, res: Response) => {
  const filter: any = {};

  if (req.query?.email) {
    //@ts-ignore
    filter.email = new RegExp(req.query?.email, "i");
  }
  if (req.query?.userRole) {
    filter.userRole = req.query?.userRole;
  }
  if (req.query?.firstName) {
    //@ts-ignore
    filter.firstName = new RegExp(req.query?.firstName, "i");
  }

  const userData = await User.find(filter);
  return res.json({
    data: userData,
  });
};

export const multipleSorting = async (req: Request, res: Response) => {
  const sort: any = {};

  // Example usage
  const sortCriteria = {
    firstName: 1, // 1 for ascending, -1 for descending
    lastName: 1, // 1 for ascending
    email: 1, // -1 for descending
    createdAt: -1,
  };

  if (req.query?.firstName) {
    sort.firstName = sortCriteria.firstName;
  }
  if (req.query?.email) {
    sort.email = sortCriteria.email;
  }
  if (req.query?.lastName) {
    sort.lastName = sortCriteria.lastName;
  }
  if (req.query?.createdAt) {
    sort.createdAt = sortCriteria.createdAt;
  }

  const userData = await User.find().sort(sort);
  return res.json({
    data: userData,
  });
};

export const multipleSortingFilter = async (req: Request, res: Response) => {
  const filter: any = {};
  const sort: any = {};

  if (req.query?.email) {
    sort.email = sort.email;
    //@ts-ignore
    filter.email = new RegExp(req.query?.email, "i");
  }
  if (req.query?.firstName) {
    sort.firstName = sort.firstName;
    //@ts-ignore
    filter.firstName = new RegExp(req.query?.firstName, "i");
  }
  if (req.query?.lastName) {
    sort.lastName = sort.lastName;
    //@ts-ignore
    filter.lastName = new RegExp(req.query?.lastName, "i");
  }

  const userData = await User.find(filter).sort(sort);
  return res.json({ data: userData });
};

export const dateRangeFilter = async (req: Request, res: Response) => {
  const { startDate, endDate }: any = req.query;
  // Validate dates
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required" });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const userData = await User.find({
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });
  return res.json({ data: userData });
};

export const sendMail = async (req: Request, res: Response) => {
  let configOptions = {
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "dev3.accelfintech@gmail.com",
      pass: "***",
    },
  };

  const auth = nodemailer.createTransport(configOptions);

  const receiver = {
    from: "dev3.accelfintech@gmail.com",
    to: "pmk873490@gmail.com",
    subject: "demo",
    text: "demo text",
  };

  const info = await auth.sendMail(receiver);

  return res.json({
    data: "send",
    id: info.messageId,
  });
};

export const firstNameGenerate = async (req: Request, res: Response) => {
  // Create an array of 10,000 documents
  const data = [];
  for (let i = 0; i < 10000; i++) {
    data.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: "password",
      userRole: UserRoleEnum.free,
    });
  }

  const result: any = await User.insertMany(data);

  return res.json({
    data: result,
  });
};

// export const importCSVFile = async (req: Request, res: Response) => {
//   // Create an array of 10,000 documents

//   return res.json({
//     data: result,
//   });
// };
