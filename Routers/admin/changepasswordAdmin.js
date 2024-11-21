import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/database.js";
import { check, hashpassword } from "../../functions/bcrypt.js";
import { checktoken, getid } from "../../functions/jwtAdmin.js";

const router = Router();

router.post("/", checktoken, async (req, res) => {
  const Schema = Joi.object({
    oldPassword: Joi.string().min(3).max(25).required(),
    newPassword: Joi.string().min(3).max(25).required(),
  });

  const id = getid(req, res);
  const { oldPassword, newPassword } = req.body;

  const validation = Schema.validate(req.body);
  if (validation.error) {
    return res.status(400).send({ error: validation.error.message });
  }

  try {
    
    const data = await pool.query(
      "SELECT id, password FROM admin WHERE id = $1",
      [id]
    );

    if (data.rows.length === 0) {
      return res.status(404).send({ error: "Foydalanuvchi topilmadi" });
    }

    const user = data.rows[0];

  
    const isPasswordValid = await check(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: "Eski parol noto‘g‘ri" });
    }


    const hashedNewPassword = await hashpassword(newPassword);
    await pool.query(
      "UPDATE admin SET password = $1 WHERE id = $2",
      [hashedNewPassword, user.id]
    );

    res.status(200).send({ message: "Parol muvaffaqiyatli o‘zgartirildi" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Ichki server xatosi" });
  }
});

export default router;

/**
 * @swagger
 * /admin/change-password:
 *   post:
 *     tags:
 *       - Admin Profili
 *     summary: Parolni o‘zgartirish
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "PASSWORD"
 *               newPassword:
 *                 type: string
 *                 example: "!NewPassword123"
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli o‘zgartirildi
 *       401:
 *         description: Eski parol noto‘g‘ri
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Ichki server xatosi
 */
