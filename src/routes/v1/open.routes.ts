import { Router } from "express";
import {
  dateRangeFilter,
  firstNameGenerate,
  getOpenController,
  multipleFilter,
  multipleSorting,
  qrcodeGenarator,
  sendMail,
} from "../../controllers/openController.controllers";
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

export default OpenRoutes;
