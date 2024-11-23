import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();



router.delete("/:id", [limiter, checktoken], async function (req, res, next) {
  try {
    const teacherId = req.params.id;

    const query = `
      UPDATE teacher
      SET state = false
      WHERE id = $1
      RETURNING id;
    `;

    const values = [teacherId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    return res.status(200).json({
      message: "O'qituvchi muvaffaqiyatli o'chirildi",
      teacherId: result.rows[0].id,
    });
  } catch (err) {
    if (err.code == "23505") return res.status(400).send({ error: err.detail });
    if (err.code == "23503") return res.status(400).send({ error: err.detail });
    if (err.code == "22P02") return res.status(400).send({ error: err.detail });
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: O'qituvchi API
 *   description: O'qituvchilarni boshqarish uchun API
 *   version: 1.0.0
 * paths:
 *   /admin/deleteteacher/{id}:
 *     delete:
 *       summary: O'qituvchini o'chirish (soft delete)
 *       description: O'qituvchini o'chirish (soft delete) va ma'lumotni faolligini o'zgartiradi.
 *       tags:
 *         - O'qituvchilar
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: O'qituvchining ID raqami
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: O'qituvchi muvaffaqiyatli o'chirildi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: O'qituvchi muvaffaqiyatli o'chirildi
 *                   teacherId:
 *                     type: integer
 *                     description: O'chirilgan o'qituvchining ID raqami.
 *         404:
 *           description: O'qituvchi topilmadi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         500:
 *           description: Ichki server xatosi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
