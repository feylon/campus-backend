import Joi from "joi";
import pool from "../../../../functions/database.js";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";

const router = Router();


router.post("/", checktoken, async function (req, res) {
  
  const schema = Joi.object({
   group_id : Joi.number().integer().min(0).required(),
   teacher_id : Joi.number().integer().min(0).required()

  });
  const checkSchema = schema.validate(req.body);
  if(checkSchema.error) return res.status(400).send({error : checkSchema.error.message});
   const {group_id, teacher_id}  = req.body;
  try {
    const data = (await pool.query(`update group_name_student set teacher_id = $1 where id = $2 returning true as updated `, [teacher_id, group_id]));
    console.log(data.rows[0])
    return res.status(200).send(data.rows[0])
  } catch (error) {
    if(error.code == '23503') return res.status(400).send({error : error.detail})
    console.log(error);
  }
});

export default router;

/**
 * @swagger
 * /admin/setTeacher:
 *   post:
 *     summary: "O'qituvchini talabalarga bog'lash"
 *     tags: 
 *       - "O'qituvchini talabalarga bog'lash"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: integer
 *                 description: "Guruhning ID raqami"
 *                 example: 1
 *               teacher_id:
 *                 type: integer
 *                 description: "O'qituvchining ID raqami"
 *                 example: 2
 *             required:
 *               - group_id
 *               - teacher_id
 *     responses:
 *       200:
 *         description: "O'qituvchi muvaffaqiyatli bog'landi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: "Yaroqsiz so'rov yoki xato ma'lumotlar"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error yoki foreign key constraint"
 */
