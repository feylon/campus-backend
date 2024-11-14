import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
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
  role_id: Joi.number().min(1).required().integer(),

});




router.post("/", [limiter, checktoken], async function (req, res, next) {
  if (Schema.validate(req.body).error)
    return res.status(400).send(Schema.validate(req.body).error.message);

  let { login, email, password, firstname, lastname, viloyat_id, tuman_id, active, role_id } =
    req.body;
    try {
      password = await hashpassword(password);
      login = login.toLowerCase();
      email = email.toLowerCase();
      let data = await pool.query(`insert into admin (login, email, password, firstname, lastname, viloyat_id, tuman_id, active,  struct, role_id) 
            values 
            ($1, $2, $3, $4, $5, $6, $7,$8, $9, $10)       
        
        `,
      [login, email, password, firstname, lastname, viloyat_id, tuman_id, active, false, role_id]
      );
      return res.status(201).send({Created : true});
    } catch (error) {
      if(error.code == "23505") return res.status(406).send({error : error.detail})


      if(error.code == "23503") return res.status(400).send({error : error.detail})
        res.status(500).send("Server Error")
        console.log(error);
    }
});

export default router;

/**
 * @swagger
 * /admin/addadmin:
 *   post:
 *     summary: Yangi admin qo'shish
 *     description: Endpoint to register a new user with details like login, password, name, email, etc.
 *     tags:
 *       - Subadminni boshqarish
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 15
 *               password:
 *                 type: string
 *                 minLength: 7
 *                 maxLength: 25
 *               firstname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 15
 *               lastname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 15
 *               email:
 *                 type: string
 *                 format: email
 *                 minLength: 3
 *                 maxLength: 25
 *               viloyat_id:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 14
 *               tuman_id:
 *                 type: integer
 *                 minimum: 15
 *                 maximum: 225
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Bearer token missing or invalid)
 */