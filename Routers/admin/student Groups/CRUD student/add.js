import Joi from "joi";
import pool from "../../../../functions/database.js";
import { Router } from "express";
import { checktoken, getid } from "../../../../functions/jwtAdmin.js";
import { hashpassword } from "../../../../functions/bcrypt.js";

const router = Router();


const studentSchema = Joi.object({
  email: Joi.string().email().required(),
  login: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(6).required(),
  Parent_Name: Joi.string().optional(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  type_study: Joi.string().valid("Grant", "Kontrakt").default("Grant"),
  course: Joi.number().integer().min(1).max(7).required(),
  brithday: Joi.date().optional(),
  group_name_id: Joi.number().default(8).integer(),
  viloyat_id: Joi.number().default(8).integer(),
  tuman_id: Joi.number().default(122),
  address: Joi.string().optional()
});

router.post("/", checktoken, async function (req, res) {
  try {

    const { error, value } = studentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
let created_by = getid(req, res);
    let {
      email,
      login,
      password,
      Parent_Name,
      firstname,
      lastname,
      type_study,
      course,
      brithday,
      group_name_id,
      viloyat_id,
      tuman_id,
      address,
      
    } = value;
    password = await hashpassword(password);
    const query = `
      INSERT INTO student (
        email, login, password,  Parent_Name, firstname, lastname, 
        type_study, course, brithday, group_name_id, viloyat_id, tuman_id, address, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    const values = [
      email, login, password,  Parent_Name, firstname, lastname, 
      type_study, course, brithday, group_name_id, viloyat_id, tuman_id, address, created_by
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
        if(err.code == "23505") return res.status(400).send({error : err.detail});
        if(err.code == "23503") return res.status(400).send({error : err.detail});
        if(err.code == "22P02") return res.status(400).send({error : err.detail});


    console.error(err);
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

export default router;

/**
 * @swagger
 * /admin/addstudent:
 *   post:
 *     summary: Yangi talabani yaratish.
 *     description: Berilgan ma'lumotlar asosida talaba yozuvini bazaga qo'shadi.
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: talaba@example.com
 *               login:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: talaba123
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: kuchliparol
 *               Parent_Name:
 *                 type: string
 *                 example: Ismoilov Akmal
 *               firstname:
 *                 type: string
 *                 example: Akmal
 *               lastname:
 *                 type: string
 *                 example: Ismoilov
 *               type_study:
 *                 type: string
 *                 enum: [Grant, Kontrakt]
 *                 default: Grant
 *                 example: Grant
 *               course:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 example: 2
 *               brithday:
 *                 type: string
 *                 format: date
 *                 example: 2003-03-15
 *               group_name_id:
 *                 type: integer
 *                 default: 8
 *                 example: 12
 *               viloyat_id:
 *                 type: integer
 *                 default: 8
 *                 example: 10
 *               tuman_id:
 *                 type: integer
 *                 default: 122
 *                 example: 135
 *               address:
 *                 type: string
 *                 example: Toshkent shahri, Chilonzor tumani, 10-mavze
 *     responses:
 *       201:
 *         description: Talaba muvaffaqiyatli yaratildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 login:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 type_study:
 *                   type: string
 *                 course:
 *                   type: integer
 *                 created_by:
 *                   type: integer
 *       400:
 *         description: So'rovda xatolik, validatsiya xatosi yoki ma'lumotlar takrorlanishi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validatsiya xato xabari
 *       500:
 *         description: Serverda ichki xatolik.
 */
