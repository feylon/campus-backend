import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

const Schema = Joi.object({
  login: Joi.string().min(5).max(15).required(),
});

router.post("/", [limiter, checktoken], async function (req, res, next) {
  try {
    
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { login } = req.body;

    const query = `SELECT id FROM teacher WHERE login = $1`;
    const result = await pool.query(query, [login]);

    if (result.rows.length > 0) {
      return res.status(200).json({ has: true });
    }

    return res.status(200).json({ has: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

/**
 * @swagger
 * /admin/checkloginTeacher:
 *   post:
 *     tags:
 *       - O'qituvchilar
 *     summary: Tekshirish login mavjudligi
 *     description: O'qituvchining login ma'lumotingiz bazada mavjudligini tekshirish.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: O'qituvchining login nomi
 *                 example: "teacher123"
 *     responses:
 *       200:
 *         description: Login mavjud yoki mavjud emas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 has:
 *                   type: boolean
 *                   description: True yoki false
 *       400:
 *         description: Xato ma'lumotlar
 *       500:
 *         description: Server xatosi
 */
