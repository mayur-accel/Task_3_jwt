import { faker } from "@faker-js/faker";
import { Router } from "express";

const FackerRoutes = Router();

FackerRoutes.get("/firstname", (req, res) => {
  let ml = Array(req.query.count ? Number(req.query.count) : 1)
    .fill(0)
    .map((e) => (e = faker.internet.userName()));

  return res.json({
    message: "messae firstname",
    demo: ml,
  });
});

export default FackerRoutes;
