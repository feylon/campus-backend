import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { check, hashpassword } from "../../../functions/bcrypt.js";
import { sign } from "../../../functions/jwtTeacher.js";

const router = Router();

router.post("/", async function (req, res, next) {
  const Schema = Joi.object({
    login: Joi.string().min(3).max(25).required(),
    password: Joi.string().min(3).max(25).required(),
  });

  const { login, password } = req.body;
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });
  try {
    let data = await pool.query(
      "Select id, login, password, active from teacher where login = $1 and state = true",
      [login]
    );

    if (data.rows.length == 0) {
      res.status(401).send({ error: "Login topilmadi" });

      return;
    }
    if (!data.rows[0].active ) {
        res.status(401).send({ error: "BLOCK" });
  
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
 * /teacher/login:
 *   post:
 *     tags:
 *       - O'qituvchi Profili va login
 *     summary: "Tizimga kirish va token olish uchun o'qituvchi login endpointi"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: "O'qituvchi login ma'lumoti"
 *                 example: "jamshid14092002"
 *               password:
 *                 type: string
 *                 description: "O'qituvchi paroli"
 *                 example: "!Jamshid14092002"
 *             required:
 *               - login
 *               - password
 *     responses:
 *       200:
 *         description: "Tizimga muvaffaqiyatli kirildi va token qaytarildi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       401:
 *         description: "Login yoki parol noto'g'ri yoki foydalanuvchi bloklangan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Login topilmadi yoki parol xato"
 *       400:
 *         description: "Yaroqsiz so'rov ma'lumotlari"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error: login maydoni talab qilinadi"
 *       500:
 *         description: "Server xatosi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Serverda xatolik yuz berdi"
 */
