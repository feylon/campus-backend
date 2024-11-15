import Joi from "joi";
import pool from "../../../../functions/database.js";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";

const router = Router();

router.put("/:id", checktoken, async function (req, res) {
  const schema = Joi.object({
    name: Joi.string().max(500).required(),
    description: Joi.string().optional(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;
  const { name, description } = value;

  try {
    const result = await pool.query(
      `UPDATE group_name_student 
       SET name = $1, description = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, description`,
      [name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(406).json({ error: error.detail });
    }
    console.error(error);
    res.status(500).json({ error: "Error Server" });
  }
});

export default router;

/**
 * @swagger
 * /admin/editGroupStudent/{id}:
 *   put:
 *     summary: Mavjud student guruhini tahrirlash
 *     tags:
 *       - Student guruhi 
 *     security:
 *       - bearerAuth: []  # Requires JWT token for authorization
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the group to be updated
 *         schema:
 *           type: integer
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
 *                 example: "Updated description of the group"
 *                 description: "Optional description of the group"
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (Invalid token)
 *       404:
 *         description: Group not found
 *       406:
 *         description: Duplicate group name
 *       500:
 *         description: Server error
 */
