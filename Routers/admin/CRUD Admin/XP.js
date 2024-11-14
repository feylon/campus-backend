import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";

const router = Router();
const Schema = Joi.object({
  login: Joi.string().required(),
});
router.post("/", async function (req, res, next) {
  console.log(req.body);
  res.status(200).send({})
});
export default router;
