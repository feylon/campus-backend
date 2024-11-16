import Joi from "joi";
import pool from "../../../../functions/database.js";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";

const router = Router();

const studentSchema = Joi.object({
  Parent_Name: Joi.string().optional(),
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  type_study: Joi.string().valid("Grant", "Kontrakt").optional(),
  course: Joi.number().integer().min(1).max(7).optional(),
  brithday: Joi.date().optional(),
  group_name_id: Joi.number().integer().optional(),
  viloyat_id: Joi.number().integer().optional(),
  tuman_id: Joi.number().integer().optional(),
  address: Joi.string().optional(),
});

router.put("/:id", checktoken, async function (req, res) {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: "Noto‘g‘ri ID format" });
    }

    let fields = [];
    let values = [];
    Object.entries(value).forEach(([key, val], index) => {
      fields.push(`${key} = $${index + 1}`);
      values.push(val);
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: "Hech qanday ma'lumot yuborilmagan" });
    }

    values.push(studentId);
    const query = `
      UPDATE student
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Talaba topilmadi" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    if (err.code === "22P02") {
      return res.status(400).send({ error: "ID noto‘g‘ri formatda" });
    }
    console.error(err);
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

export default router;

/**
 * @swagger
 * /admin/editstudent/{id}:
 *   put:
 *     summary: Talaba ma'lumotlarini tahrirlash.
 *     description: Bazadagi mavjud talabaning ma'lumotlarini yangilaydi, lekin email, login, va password tahrir qilinmaydi.
 *     tags:
 *       - Talabalar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tahrir qilinayotgan talabani ID raqami.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Parent_Name:
 *                 type: string
 *                 example: Ismoilov Azamat
 *               firstname:
 *                 type: string
 *                 example: Azamat
 *               lastname:
 *                 type: string
 *                 example: Ismoilov
 *               type_study:
 *                 type: string
 *                 enum: [Grant, Kontrakt]
 *                 example: Kontrakt
 *               course:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 example: 4
 *               brithday:
 *                 type: string
 *                 format: date
 *                 example: 2002-04-10
 *               group_name_id:
 *                 type: integer
 *                 example: 15
 *               viloyat_id:
 *                 type: integer
 *                 example: 14
 *               tuman_id:
 *                 type: integer
 *                 example: 140
 *               address:
 *                 type: string
 *                 example: Samarqand shahri, Registon ko'chasi, 25
 *     responses:
 *       200:
 *         description: Talaba muvaffaqiyatli tahrirlandi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 type_study:
 *                   type: string
 *                 course:
 *                   type: integer
 *       400:
 *         description: Noto‘g‘ri so‘rov yoki validatsiya xatosi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validatsiya xato xabari
 *       404:
 *         description: Talaba topilmadi.
 *       500:
 *         description: Serverda ichki xatolik.
 */
