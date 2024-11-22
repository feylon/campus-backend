import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";

import { limiter } from "../../../functions/limiter.js";

const router = Router();

const Schema = Joi.object({
  firstname: Joi.string().min(3).max(15).required(),
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

router.put("/:id", [limiter, checktoken], async function (req, res, next) {
  try {
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      firstname,
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

    const teacherId = req.params.id; 
 

    const query = `
      UPDATE teacher
      SET 
        firstname = $1,
        lastname = $2,
        viloyat_id = $3,
        tuman_id = $4,
        active = $5,
        telegramID = $6,
        brithday = $7,
        address = $8,
        Parent_Name = $9,
        struct = $10
       
      WHERE id = $11
      RETURNING id;
    `;

    const values = [
      firstname,
      lastname,
      viloyat_id,
      tuman_id,
      active,
      telegramID || null,
      birthday || null,
      address || null,
      Parent_Name || null,
      struct,
      
      teacherId,
    ];

    const result = await pool.query(query, values);
    const updatedTeacherId = result.rows[0].id;

    return res.status(200).json({
      message: "O'qituvchi ma'lumotlari yangilandi",
      teacherId: updatedTeacherId,
    });
  } catch (err) {
    if (err.code == "23505") return res.status(400).send({ error: err.detail });
    if (err.code == "23503") return res.status(400).send({ error: err.detail });
    if (err.code == "22P02") return res.status(400).send({ error: err.detail });
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
 *   /admin/editteacher/{id}:
 *     put:
 *       summary: O'qituvchining ma'lumotlarini yangilash
 *       description: O'qituvchining mavjud ma'lumotlarini yangilaydi.
 *       tags:
 *         - O'qituvchilar
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: O'qituvchining ID raqami
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - firstname
 *                 - lastname
 *                 - viloyat_id
 *                 - tuman_id
 *                 - active
 *               properties:
 *                 firstname:
 *                   type: string
 *                   minLength: 3
 *                   maxLength: 15
 *                   description: O'qituvchining ismi.
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
 *         200:
 *           description: O'qituvchi muvaffaqiyatli yangilandi
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: O'qituvchi ma'lumotlari yangilandi
 *                   teacherId:
 *                     type: integer
 *                     description: Yangilangan o'qituvchining ID raqami.
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
