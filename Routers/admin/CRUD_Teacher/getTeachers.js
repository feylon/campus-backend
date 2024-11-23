import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

const Schema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  size: Joi.number().integer().min(1).required(),
});
router.get("/", [limiter, checktoken], async function (req, res, next) {
  const check = Schema.validate(req.query);
  if (check.error) return res.status(400).send({ error: check.error.message });

  const { page, size } = req.query;
  const offset = (page - 1) * size;

  try {
    const data = await pool.query(
      `
            SELECT 
                teacher.id,
                teacher.login,
                teacher.email,
                teacher.firstname,
                teacher.lastname,
                teacher.parent_name,
                teacher.brithday,
                teacher.created_at,
                teacher.active,
                teacher.viloyat_id,
                viloyat.name_uz as viloyat,
                tuman.name_uz as tuman,
                teacher.address,
                (Select count(*) from teacher where state = true) as allteacher

            FROM teacher
            INNER JOIN viloyat ON viloyat.id = teacher.viloyat_id
            INNER JOIN tuman ON tuman.id = teacher.tuman_id
            order by teacher.login
            LIMIT $1 OFFSET $2
            `,
      [size, offset]
    );

    res.status(200).send({ data: data.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;

/**
 * @swagger
 * /admin/getTeachers:
 *   get:
 *     summary: O'qituvchilar ro'yxatini sahifalash orqali olish
 *     tags:
 *       - O'qituvchilar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Sahifa raqami (sahifalash uchun)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Har bir sahifadagi yozuvlar soni
 *     responses:
 *       200:
 *         description: O'qituvchilar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: O'qituvchi ID-si
 *                       login:
 *                         type: string
 *                         description: Login nomi
 *                       email:
 *                         type: string
 *                         description: Elektron pochta manzili
 *                       firstname:
 *                         type: string
 *                         description: Ismi
 *                       lastname:
 *                         type: string
 *                         description: Familiyasi
 *                       parent_name:
 *                         type: string
 *                         description: Otasining ismi
 *                       brithday:
 *                         type: string
 *                         format: date
 *                         description: Tug'ilgan sanasi
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Tizimga qo'shilgan sana
 *                       active:
 *                         type: boolean
 *                         description: Faollik holati
 *                       viloyat:
 *                         type: string
 *                         description: Viloyat nomi
 *                       tuman:
 *                         type: string
 *                         description: Tuman nomi
 *                       address:
 *                         type: string
 *                         description: Manzil
 *       400:
 *         description: Xato so'rov parametrlari
 *       500:
 *         description: Ichki server xatosi
 */
