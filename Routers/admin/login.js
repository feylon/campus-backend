import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/database.js";
import { check } from "../../functions/bcrypt.js";
import { sign } from "../../functions/jwtAdmin.js";

const router = Router();

router.post("/", async function (req, res, next) {
  const Schema = Joi.object({
    login: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(3).max(25).required(),
  });

  const { login, password } = req.body;
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  try {
    let data = await pool.query(
      "Select id, login, password from admin where login = $1",
      [login]
    );

    if (data.rows.length == 0) {
      res.status(401).send({ error: "Login topilmadi" });

      return;
    }

    let checkAuth = await check(password, data.rows[0].password);
    if (checkAuth) {
      const token = sign(data.rows[0].id);
      res.status(200).send({ token });

      return;
    } else {
      return res.status(401).send({ error: "Parol xato" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
/**
 * @swagger
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin Profili
 *     summary: Tizimga kirish uchun va tokenni olish uchun
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: "jamshid14092002"
 *               password:
 *                 type: string
 *                 example: "!Jamshid14092002"
 *     responses:
 *       200:
 *         description: Successfully logged in and token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "Token abc20021204..."
 *       401:
 *         description: Invalid credentials
 */
