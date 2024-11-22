import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

const Schema = Joi.object({
  firstname: Joi.string().min(3).max(15).required(),
  lastname: Joi.string().min(3).max(15).required(),
  viloyat_id: Joi.number().min(0).max(14).required().integer(),
  tuman_id: Joi.number().min(15).max(225).integer().required(),
  active: Joi.boolean().required(),
  birthday: Joi.date().allow(null),
  address: Joi.string().max(500).allow(null),
  Parent_Name: Joi.string().max(500).allow(null),
  struct: Joi.boolean().default(false),
});

router.put("/:id", [limiter, checktoken], async function (req, res, next) {
  try {
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      firstname,
      lastname,
      viloyat_id,
      tuman_id,
      active,
      birthday,
      address,
      Parent_Name,
      struct,
    } = req.body;

    const teacherId = req.params.id;

    // Check if the teacher exists
    const checkTeacherQuery = `SELECT id FROM teacher WHERE id = $1`;
    const teacherResult = await pool.query(checkTeacherQuery, [teacherId]);

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Update the teacher's details
    const query = `
      UPDATE teacher
      SET
        firstname = $1,
        lastname = $2,
        viloyat_id = $3,
        tuman_id = $4,
        active = $5,
        birthday = $6,
        address = $7,
        Parent_Name = $8,
        struct = $9
      WHERE id = $10
      RETURNING id;
    `;
    const values = [
      firstname,
      lastname,
      viloyat_id,
      tuman_id,
      active,
      birthday || null,
      address || null,
      Parent_Name || null,
      struct,
      teacherId,
    ];

    const result = await pool.query(query, values);

    // Respond with the updated teacher's ID
    return res.status(200).json({
      message: "Teacher successfully updated",
      teacherId: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

/**
 * @swagger
 * /admin/editteacher/{id}:
 *   put:
 *     summary: O'qituvchini tahrirlash
 *     description: O'qituvchining ma'lumotlarini yangilash.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: O'qituvchining ID raqami
 *         required: true
 *         schema:
 *           type: integer
 *       - name: firstname
 *         in: body
 *         description: O'qituvchining ismi
 *         required: true
 *         schema:
 *           type: string
 *       - name: lastname
 *         in: body
 *         description: O'qituvchining familiyasi
 *         required: true
 *         schema:
 *           type: string
 *       - name: viloyat_id
 *         in: body
 *         description: Viloyat ID
 *         required: true
 *         schema:
 *           type: integer
 *       - name: tuman_id
 *         in: body
 *         description: Tuman ID
 *         required: true
 *         schema:
 *           type: integer
 *       - name: active
 *         in: body
 *         description: O'qituvchi faolmi yoki yo'qligi
 *         required: true
 *         schema:
 *           type: boolean
 *       - name: birthday
 *         in: body
 *         description: O'qituvchining tug'ilgan sanasi
 *         schema:
 *           type: string
 *           format: date
 *       - name: address
 *         in: body
 *         description: O'qituvchining manzili
 *         schema:
 *           type: string
 *       - name: Parent_Name
 *         in: body
 *         description: O'qituvchining ota-onasi ismi
 *         schema:
 *           type: string
 *       - name: struct
 *         in: body
 *         description: Struktura holati
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: O'qituvchi muvaffaqiyatli yangilandi
 *       400:
 *         description: Xato ma'lumotlar
 *       404:
 *         description: O'qituvchi topilmadi
 *       500:
 *         description: Server xatosi
 */
