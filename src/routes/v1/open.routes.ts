import { faker } from "@faker-js/faker";
import { Router } from "express";
import { TagIdArray, UserIdArray } from "../../constant/userId";
import {
  dateRangeFilter,
  firstNameGenerate,
  getOpenController,
  htmlToPDFGenerate,
  multipleFilter,
  multipleSorting,
  pdfGenerate,
  qrcodeGenarator,
  sendMail,
} from "../../controllers/openController.controllers";
import { Post } from "../../models/post.model";
import { Tag } from "../../models/tag.model";
import User from "../../models/user.models";
import { asyncWrapper } from "../../utils/asyncWrapper";

const OpenRoutes = Router();

OpenRoutes.get("/", asyncWrapper(getOpenController));

OpenRoutes.get("/generate-qrcode", asyncWrapper(qrcodeGenarator));

OpenRoutes.get("/daterange-filter", asyncWrapper(dateRangeFilter));

OpenRoutes.get("/multiple-filter", asyncWrapper(multipleFilter));

OpenRoutes.get("/multiple-sorting", asyncWrapper(multipleSorting));

OpenRoutes.get("/multiple-sorting-filter", asyncWrapper(multipleSorting));

OpenRoutes.get("/send-mail", asyncWrapper(sendMail));

OpenRoutes.get("/first-name", asyncWrapper(firstNameGenerate));

OpenRoutes.get("/generate-pdf", asyncWrapper(pdfGenerate));

OpenRoutes.get("/generate-html-pdf", asyncWrapper(htmlToPDFGenerate));

OpenRoutes.get("/user_id", async (req, res) => {
  const userData = await User.find({});
  const result = userData.map((item) => {
    return item._id;
  });
  return res.json({
    data: result,
  });
});

OpenRoutes.get("/tags_id", async (req, res) => {
  const mainresult = await Tag.find({});
  const result = mainresult.map((item) => item._id);
  return res.json({
    data: result,
  });
});

OpenRoutes.get("/tags-insert", async (req, res) => {
  let result = [];

  for (let i = 0; i < 100; i++) {
    const data = {
      name: faker.person.jobTitle(),
    };
    result.push(data);
  }

  const uniq = [...new Set(result)];

  const mainresult: any = await Tag.insertMany(uniq);
  return res.json({
    uniq,
    data: mainresult,
  });
});

OpenRoutes.get("/post-insert", async (req, res) => {
  const tagLenght = TagIdArray.length;
  const userLenght = UserIdArray.length;

  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }
  const postDataArray = [];
  for (let i = 0; i < 500; i++) {
    const userId = UserIdArray[getRandomInt(userLenght)];
    const length = getRandomInt(10);
    const randomArray = [];
    for (let i = 0; i < length; i++) {
      // Generate a random integer between minValue and maxValue
      const randomInt = TagIdArray[getRandomInt(tagLenght)];
      randomArray.push(randomInt);
    }

    const newData = {
      title: faker.company.name(),
      description: faker.lorem.paragraph(10),
      userId,
      tags: randomArray,
    };
    postDataArray.push(newData);
  }
  const mainresult: any = await Post.insertMany(postDataArray);
  return res.json({
    data: mainresult,
  });
});

export default OpenRoutes;
