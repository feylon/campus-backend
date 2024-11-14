import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

router.post("/", [limiter, checktoken], async function (req, res) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const { name } = value;
    const result = await pool.query(
      "INSERT INTO admin_role (name) VALUES ($1) RETURNING id, name, created_at;",
      [name]
    );

    res.status(201).send({
      id: result.rows[0].id,
      name: result.rows[0].name,
      created_at: result.rows[0].created_at,
    });
  } catch (error) {
    if(error.code == "23505") return res.status(406).send({error : error.detail})

    console.log(err);
    res.status(500).send({ error: "Serverda xato yuz berdi" });
  }
});

export default router;

/**
 * @swagger
 * /admin/create_role:
 *   post:
 *     summary: Admin roli yaratish
 *     description: Yangi admin roli yaratish va ma'lumotlar bazasiga qo'shish.
 *     tags:
 *       - Admin rollarini boshqarish
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin rolining nomi
 *                 example: "Super Admin"
 *     responses:
 *       201:
 *         description: Yangi admin roli muvaffaqiyatli yaratildi.
 *       400:
 *         description: Yaroqsiz ma'lumot yoki invalid input.
 *       401:
 *         description: Avtorizatsiya muvaffaqiyatsiz - Token yo'q yoki yaroqsiz.
 *       500:
 *         description: Serverda xato yuz berdi.
 */
