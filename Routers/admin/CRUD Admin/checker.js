import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";

const router = Router();
const Schema = Joi.object({
  login: Joi.string().required(),
});
router.post("/", checktoken, async function (req, res, next) {
  if (Schema.validate(req.body).error)
    return res
      .status(400)
      .send({ error: Schema.validate(req.body).error.message });
  let { login } = req.body;
  try {
    let data = await pool.query(
      `SELECT count(*) FROM admin WHERE login ILIKE '%' || $1 || '%'`,
      [login]
    );
    data.rows[0].count != 0
      ? res.status(200).send({ hasadmin: true })
      : res.status(200).send({ hasadmin: false });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
    console.log(error);
  }
});
export default router;
/**
 * @swagger
 * /admin/hasadmin:
 *   post:
 *     summary: Admin bor yo'qligini tekshirish
 *     description: Berilgan admin loginining ma'lumotlar bazasida mavjudligini tekshirish uchun endpoint.
 *     tags:
 *       - Subadminni boshqarish
 *     security:
 *       - bearerAuth: [] # Agar siz Bearer Token autentifikatsiyasidan foydalanayotgan bo'lsangiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: Mavjudligini tekshirish uchun login nomi.
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli bajarilgan operatsiya
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasadmin:
 *                   type: boolean
 *                   description: Admin loginining mavjudligini bildiradi.
 *                   example: true
 *       400:
 *         description: Tekshirish xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tekshirish xatosi xabari.
 *                   example: "login kiritilishi shart"
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Server muammosini bildiruvchi xato xabari.
 *                   example: "Serverda xato"
 */
