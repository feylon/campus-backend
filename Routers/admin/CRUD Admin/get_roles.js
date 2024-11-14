import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

/**
 * @swagger
 * /admin/get_roles:
 *   get:
 *     summary: Barcha admin rollar ro‘yxatini olish
 *     description: Barcha admin rollarni nomi bo‘yicha saralab qaytaradi. Token autentifikatsiyasi talab qilinadi.
 *     tags:
 *       - Admin rollarini boshqarish
 *     security:
 *       - bearerAuth: [] # Agar siz Bearer Token autentifikatsiyasidan foydalanayotgan bo'lsangiz
 *     responses:
 *       200:
 *         description: Admin rollar ro‘yxati.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Admin roli uchun noyob identifikator.
 *                   name:
 *                     type: string
 *                     description: Admin rolining nomi.
 *       401:
 *         description: Avtorizatsiya muvaffaqiyatsiz - Token yo'q yoki yaroqsiz.
 *       429:
 *         description: Juda ko‘p so‘rov - Cheklangan daraja oshib ketdi.
 *       500:
 *         description: Serverda xato yuz berdi.
 */
router.get("/", [limiter, checktoken], async function (req, res, next) {
  try {
    const data = await pool.query(`
      select 
      * from admin_role
      order by name;
    `);

    res.status(200).send(data.rows);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Serverda xato" });
  }
});

export default router;
