import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";
import pool from "../../../../functions/database.js";
import { limiter } from "../../../../functions/limiter.js";
const router = Router();

const Schema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  size: Joi.number().integer().min(1).required(),
});

router.get("/", [limiter, checktoken], async function (req, res, next) {
  const check = Schema.validate(req.query);
  if (check.error) return res.status(400).send({ error: check.error.message });
  const { page, size } = req.query;
  try {
    const data = await pool.query(
      `SELECT 
group_name_student.id as GroupId,
group_name_student.name as GroupName, 
group_name_student.created_at GroupCreatedTime,
group_name_student.description Group_Description,
group_name_student.teacher_id TeacherID,
(SELECT COUNT(*)  
FROM group_name_student 
WHERE teacher_id IS  NULL) AS ALL
FROM public.group_name_student
ORDER BY group_name_student.name
limit $1 offset $2;
            `,
      [size, (page - 1) * size]
    );

    res.status(200).send(data.rows);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});
export default router;

/**
 * @swagger
 * /admin/getGroupsUnActive:
 *   get:
 *     summary: "Guruhlar ro'yxatini olish(Bog'lanmaganlarini)"
 *     tags: 
 *       - "Student guruhi"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Sahifa raqami"
 *         example: 1
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: "Har bir sahifadagi ma'lumotlar soni"
 *         example: 10
 *     responses:
 *       200:
 *         description: "Guruhlar ro'yxati"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   GroupId:
 *                     type: integer
 *                     example: 1
 *                   GroupName:
 *                     type: string
 *                     example: "Mathematics Group"
 *                   GroupCreatedTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-01T00:00:00Z"
 *                   Group_Description:
 *                     type: string
 *                     example: "Guruh haqida ma'lumot"
 *                   TeacherName:
 *                     type: integer
 *                     example: 3
 *                   teacher_lastname:
 *                     type: string
 *                     example: "Smith"
 *                   teacher_firstname:
 *                     type: string
 *                     example: "John"
 *       400:
 *         description: "Notog'ri so'rov parametrlari"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *       500:
 *         description: "Server xatosi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
