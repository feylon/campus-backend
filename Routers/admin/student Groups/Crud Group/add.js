import Joi from "joi";
import pool from "../../../../functions/database.js";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";

const router = Router();


router.post("/", checktoken, async function (req, res) {
  
  const schema = Joi.object({
    name: Joi.string().max(500).required(),
    description: Joi.string().optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, description } = value;

  try {
    const result = await pool.query(
      "INSERT INTO group_name_student (name, description) VALUES ($1, $2) RETURNING id, name, created_at, description",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if(error.code == "23505") return res.status(406).send({error : error.detail})
      console.log(error)
    res.status(500).json({ error: "Error Server" });
  }
});

export default router;

/**
 * @swagger
 * /admin/addGroupStudent:
 *   post:
 *     summary: Yangi student guruhini yaratish
 *     tags:
 *       - Student guruhi 
 *     security:
 *       - bearerAuth: []  # Requires JWT token for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 500
 *                 example: "KI-21-02"
 *                 description: "Group name"
 *               description:
 *                 type: string
 *                 example: "This is an optional group description."
 *                 description: "Optional description of the group"
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (Invalid token)
 *       500:
 *         description: Server error
 */
