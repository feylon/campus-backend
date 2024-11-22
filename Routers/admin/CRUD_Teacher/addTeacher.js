import Joi from "joi";
import { Router } from "express";
import { checktoken, getid } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { hashpassword } from "../../../functions/bcrypt.js";
import { limiter } from "../../../functions/limiter.js";

const router = Router();

const Schema = Joi.object({
  login: Joi.string().min(5).max(15).required(),
  password: Joi.string().min(7).max(25).required(),
  firstname: Joi.string().min(3).max(15).required(),
  email: Joi.string().min(3).max(25).required().email(),
  lastname: Joi.string().min(3).max(15).required(),
  viloyat_id: Joi.number().min(0).max(14).required().integer(),
  tuman_id: Joi.number().min(15).max(225).integer().required(),
  active: Joi.boolean().required(),
  telegramID: Joi.number().integer().allow(null),
  birthday: Joi.date().allow(null),
  address: Joi.string().max(500).allow(null),
  Parent_Name: Joi.string().max(500).allow(null),
  struct: Joi.boolean().default(false),
});

router.post("/", [limiter, checktoken], async function (req, res, next) {
  try {
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      login,
      password,
      firstname,
      email,
      lastname,
      viloyat_id,
      tuman_id,
      active,
      telegramID,
      birthday,
      address,
      Parent_Name,
      struct,
    } = req.body;

    const hashedPassword = await hashpassword(password);
    

    const created_by = getid(req, res); 

 
    const query = `
      INSERT INTO teacher (
        email, login, password, telegramID, firstname, lastname, brithday, address,
        viloyat_id, tuman_id, Parent_Name, created_by,  active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    const values = [
      email,
      login,
      hashedPassword,
      telegramID || null,
      firstname,
      lastname,
      birthday || null,
      address || null,
      viloyat_id,
      tuman_id,
      Parent_Name || null,
      created_by,
      
      active,
    ];

    const result = await pool.query(query, values);
    const newTeacherId = result.rows[0].id;

   
    return res.status(201).json({
      message: "O'qituvchi yaratildi",
      teacherId: newTeacherId,
    });
  } catch (err) {
    if(err.code == "23505") return res.status(400).send({error : err.detail});
        if(err.code == "23503") return res.status(400).send({error : err.detail});
        if(err.code == "22P02") return res.status(400).send({error : err.detail});
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: O'qituvchi API
 *   description: O'qituvchilarni boshqarish uchun API
 *   version: 1.0.0
 * paths:
 *   /admin/addteacher:
 *     post:
 *       summary: Yangi o'qituvchi qo'shish
 *       description: Yangi o'qituvchini qo'shadi va ma'lumotni bazaga saqlaydi.
 *       tags:
 *         - O'qituvchilar
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - login
 *                 - password
 *                 - firstname
 *                 - email
 *                 - lastname
 *                 - viloyat_id
 *                 - tuman_id
 *                 - active
 *               properties:
 *                 login:
 *                   type: string
 *                   minLength: 5
 *                   maxLength: 15
 *                   description: O'qituvchining noyob login nomi.
 *                 password:
 *                   type: string
 *                   minLength: 7
 *                   maxLength: 25
 *                   description: O'qituvchining akkaunt uchun paroli.
 *                 firstname:
 *                   type: string
 *                   minLength: 3
 *                   maxLength: 15
 *                   description: O'qituvchining ismi.
 *                 email:
 *                   type: string
 *                   format: email
 *                   minLength: 3
 *                   maxLength: 25
 *                   description: O'qituvchining elektron pochtasi.
 *                 lastname:
 *                   type: string
 *                   minLength: 3
 *                   maxLength: 15
 *                   description: O'qituvchining familiyasi.
 *                 viloyat_id:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 14
 *                   description: Viloyat ID raqami.
 *                 tuman_id:
 *                   type: integer
 *                   minimum: 15
 *                   maximum: 225
 *                   description: Tuman ID raqami.
 *                 active:
 *                   type: boolean
 *                   description: O'qituvchining faol holati.
 *                 telegramID:
 *                   type: integer
 *                   nullable: true
 *                   description: O'qituvchining Telegram ID raqami.
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                   description: O'qituvchining tug'ilgan kuni.
 *                 address:
 *                   type: string
 *                   maxLength: 500
 *                   nullable: true
 *                   description: O'qituvchining manzili.
 *                 Parent_Name:
 *                   type: string
 *                   maxLength: 500
 *                   nullable: true
 *                   description: Ota-onaning yoki vasiyning ismi.
 *                 struct:
 *                   type: boolean
 *                   default: false
 *                   description: Strukturaviy holatini bildiradi.
 *       responses:
 *         201:
 *           description: O'qituvchi muvaffaqiyatli yaratildi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: O'qituvchi yaratildi
 *                   teacherId:
 *                     type: integer
 *                     description: Yangi yaratilgan o'qituvchining ID raqami.
 *         400:
 *           description: Xato so'rov, validatsiya yoki baza xatosi tufayli
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         500:
 *           description: Ichki server xatosi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
