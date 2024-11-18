import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";
import pool from "../../../../functions/database.js";
import { limiter } from "../../../../functions/limiter.js";
const router = Router();

const Schema = Joi.object({
    student_id: Joi.number().integer().required()
});

router.delete("/", [limiter, checktoken], async function (req, res, next) {
    const check = Schema.validate(req.body);
    if (check.error) return res.status(400).send({ error: check.error.message });
    
    const { student_id } = req.body;
    try {
        const result = await pool.query(`
            UPDATE student
            SET state = false
            WHERE id = $1
            RETURNING id;
        `, [student_id]);

        if (result.rowCount === 0) {
            return res.status(404).send({ error: "Mavjud emas" });
        }

        res.status(200).send({ message: "Talaba o'chirildi.", student_id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error" });
    }
});

export default router;

/**
 * @swagger
 * /admin/deletestudent:
 *   delete:
 *     summary: Talabani o'chirish
 *     description: Talabani tizimdan o'chirish yoki faol emas holatga o'tkazish.
 *     tags:
 *       - Talabalar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: O'chiriladigan talabani ID raqami.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Talaba muvaffaqiyatli o'chirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Muvaffaqiyat xabari.
 *                 student_id:
 *                   type: integer
 *                   description: O'chirilgan talabani ID raqami.
 *       400:
 *         description: Yaroqsiz so'rov ma'lumotlari.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xatolik xabari.
 *       404:
 *         description: Talaba topilmadi yoki allaqachon faol emas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xatolik xabari.
 *       500:
 *         description: Serverda xatolik yuz berdi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xatolik xabari.
 */
