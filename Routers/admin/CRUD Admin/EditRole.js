import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

router.put("/:id", [limiter, checktoken], async function (req, res) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
  });

  const schemaID = Joi.object({
    id: Joi.number().min(0).integer().required(),
  });

  if (schemaID.validate(req.params).error) {
    return res.status(400).send({ error: schemaID.validate(req.params).error.message });
  }

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    const { name } = value;
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE admin_role SET name = $1 WHERE id = $2 RETURNING id, name;",
      [name, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ error: "Admin topilmadi" });
    }

    res.status(200).send({
      id: result.rows[0].id,
      name: result.rows[0].name
    });
  } catch (error) {
    if (error.code == "23505") return res.status(406).send({ error: error.detail });

    console.log(error);
    res.status(500).send({ error: "Serverda xato yuz berdi" });
  }
});

export default router;

/**
 * @swagger
 * /admin/edit_role/{id}:
 *   put:
 *     summary: Admin roli tahrirlash
 *     description: Mavjud admin rolini tahrirlash va ma'lumotlar bazasini yangilash.
 *     tags:
 *       - Admin rollarini boshqarish
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Tahrirlanadigan admin rolining ID raqami.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin rolining yangi nomi
 *                 example: "Super Admin"
 *     responses:
 *       200:
 *         description: Admin roli muvaffaqiyatli tahrirlandi.
 *       400:
 *         description: Yaroqsiz ma'lumot yoki invalid input.
 *       401:
 *         description: Avtorizatsiya muvaffaqiyatsiz - Token yo'q yoki yaroqsiz.
 *       404:
 *         description: Admin roli topilmadi.
 *       500:
 *         description: Serverda xato yuz berdi.
 */
