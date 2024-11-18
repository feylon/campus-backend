import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../../functions/jwtAdmin.js";
import pool from "../../../../functions/database.js";
import { limiter } from "../../../../functions/limiter.js";
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
student.id as student_id,
student.email as student_email,
student.login as student_login,
student.parent_name as student_parent_name,
student.firstname as student_firstname,
student.lastname as student_lastname,
student.type_study as student_type_study,
student.course as student_course,
student.group_name_id as group_id,
(Select count(*) from student where state = true) as allstudent,
group_name_student.name as groupname,
student.viloyat_id as viloyat_id,
viloyat.name_uz as viloyat,
tuman.name_uz as tuman
from student
inner join group_name_student on group_name_student.id = student.group_name_id 
inner join viloyat on viloyat.id = student.viloyat_id
inner join tuman on tuman.id = student.tuman_id
where student.state = true
order by student.lastname
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
 * /admin/getstudent:
 *   get:
 *     summary: O'quvchilar ro'yxatini olish
 *     description: O'quvchilarni sahifalash va saralash orqali olish uchun ishlatiladi.
 *     tags:
 *       - Talabalar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sahifa raqami (kamida 1 bo'lishi kerak).
 *       - in: query
 *         name: size
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Bir sahifada nechta yozuv bo'lishi kerakligi.
 *     responses:
 *       200:
 *         description: O'quvchilar ro'yxati muvaffaqiyatli olindi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: integer
 *                   description: O'quvchining ID raqami.
 *                 student_email:
 *                   type: string
 *                   description: O'quvchining email manzili.
 *                 student_login:
 *                   type: string
 *                   description: O'quvchining login ma'lumotlari.
 *                 student_parent_name:
 *                   type: string
 *                   description: O'quvchining ota-onasi ismi.
 *                 student_firstname:
 *                   type: string
 *                   description: O'quvchining ismi.
 *                 student_lastname:
 *                   type: string
 *                   description: O'quvchining familiyasi.
 *                 student_type_study:
 *                   type: string
 *                   description: O'quvchining o'qish turi.
 *                 student_course:
 *                   type: integer
 *                   description: O'quvchining kurs raqami.
 *                 group_id:
 *                   type: integer
 *                   description: O'quvchining guruh ID raqami.
 *                 allstudent:
 *                   type: integer
 *                   description: Umumiy faol o'quvchilar soni.
 *                 groupname:
 *                   type: string
 *                   description: Guruh nomi.
 *                 viloyat_id:
 *                   type: integer
 *                   description: Viloyat ID raqami.
 *                 viloyat:
 *                   type: string
 *                   description: Viloyat nomi.
 *                 tuman:
 *                   type: string
 *                   description: Tuman nomi.
 *       400:
 *         description: Yaroqsiz so'rov ma'lumotlari.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xatolik xabari.
 *       500:
 *         description: Serverda xatolik yuz berdi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xatolik xabari.
 */
