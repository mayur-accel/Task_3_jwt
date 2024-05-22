import { Router } from "express";
import {
  createUrlController,
  deleteURLController,
  getAllURLController,
  getByIdURLController,
  updateURLController,
  urlRedirectController,
} from "../../controllers/url.controllers";
import { asyncWrapper } from "../../utils/asyncWrapper";

const URLRoutes = Router();

// create url
URLRoutes.post("/", asyncWrapper(createUrlController));

// get all url redirect
URLRoutes.get("/", asyncWrapper(getAllURLController));

// redirect route
URLRoutes.get("/redirect/:urlId", asyncWrapper(urlRedirectController));

// get by url
URLRoutes.get("/:urlId", asyncWrapper(getByIdURLController));

// update url
URLRoutes.patch("/:urlId", asyncWrapper(updateURLController));

// delete url
URLRoutes.delete("/:urlId", asyncWrapper(deleteURLController));

export default URLRoutes;
