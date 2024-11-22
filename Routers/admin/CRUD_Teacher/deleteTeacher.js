import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

router.delete("/:id", [limiter, checktoken], async function (req, res, next) {
  try {
    const teacherId = req.params.id;

    const checkTeacherQuery = `SELECT id, state FROM teacher WHERE id = $1`;
    const teacherResult = await pool.query(checkTeacherQuery, [teacherId]);

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    if (teacherResult.rows[0].state === false) {
      return res.status(400).json({ error: "Teacher already deleted" });
    }

    const query = `
      UPDATE teacher
      SET state = false
      WHERE id = $1
      RETURNING id;
    `;
    const values = [teacherId];
    
    const result = await pool.query(query, values);

   
    return res.status(200).json({
      message: "O'qituvchi o'chirildi",
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
 * /admin/deleteteacher/{id}:
 *   delete:
 *     summary: O'qituvchini o'chirish (soft delete)
 *     description: O'qituvchining holatini false qilib o'zgartirish (soft delete).
 *     parameters:
 *       - name: id
 *         in: path
 *         description: O'qituvchining ID raqami
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'qituvchi muvaffaqiyatli o'chirildi (soft delete)
 *       400:
 *         description: O'qituvchi allaqachon o'chirilgan
 *       404:
 *         description: O'qituvchi topilmadi
 *       500:
 *         description: Server xatosi
 */
