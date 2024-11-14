import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";
const router = Router();

const Schema = Joi.object({
    page : Joi.number().integer().min(1).required(),
    size : Joi.number().integer().min(1).required()
}
);

router.get("/", [limiter, checktoken], async function (req, res, next) {
    const check = Schema.validate(req.query);
    if(check.error) return res.status(400).send({error : check.error.message})
    const {page, size} = req.query;
    try {
        const data = await pool.query(`
select 
admin.id as admin_id,
admin.login,
admin.firstname,
admin.lastname,
admin.active,
admin.lastseen,
admin.viloyat_id as viloyat_id,
viloyat.name_uz as viloyat,
tuman.name_uz as tuman,
(Select count(*) from admin where state = true) as all
from admin
inner join viloyat on viloyat.id = admin.viloyat_id
inner join tuman on tuman.id = admin.tuman_id
where admin.state = true
order by admin.login
limit $1 offset $2;
            `, [size, (page - 1) * size]);

res.status(200).send(data.rows);
return;
    } catch (error) {
        console.log(error)
        res.status(500).send({error : "Server error"})
    }
    
    });
    export default router;


    /**
 * @swagger
 * /admin/getadmin:
 *   get:
 *     summary: Sahifalangan admin ma'lumotlarini olish
 *     description: Faol adminlarning umumiy soni bilan birga sahifalangan adminlar ro'yxatini olish.
 *     tags:
 *       - Subadminni boshqarish
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         description: Sahifa raqami (0-dan boshlanadi).
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: size
 *         in: query
 *         required: true
 *         description: Har bir sahifada qaytariladigan elementlar soni.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: Adminlar ro'yxati va umumiy soni
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   admin_id:
 *                     type: integer
 *                     description: Admin uchun noyob identifikator.
 *                   login:
 *                     type: string
 *                     description: Adminning login'i.
 *                   firstname:
 *                     type: string
 *                     description: Adminning ismi.
 *                   lastname:
 *                     type: string
 *                     description: Adminning familiyasi.
 *                   profil_url:
 *                     type: string
 *                     description: Adminning profiliga havola.
 *                   active:
 *                     type: boolean
 *                     description: Admin faol yoki emasligini ko'rsatadi.
 *                   lastseen:
 *                     type: string
 *                     format: date-time
 *                     description: Admin oxirgi marta qachon ko'rilgan.
 *                   viloyat_id:
 *                     type: integer
 *                     description: Viloyat (mintaqa) IDsi.
 *                   viloyat:
 *                     type: string
 *                     description: Viloyat (mintaqa) nomi.
 *                   tuman:
 *                     type: string
 *                     description: Tuman (tuman) nomi.
 *                   all:
 *                     type: integer
 *                     description: Barcha faol adminlarning umumiy soni.
 *       '400':
 *         description: Yomon so'rov (tekshirish xatosi)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Tekshirish xatosi xabari.
 *       '500':
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari.
 */
