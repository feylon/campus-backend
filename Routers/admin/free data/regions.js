import {Router} from "express";
import pool from "../../../functions/database.js";

import Joi from "joi";


const router = Router();
/**
 * @swagger
 * /regions/viloyat:
 *   get:
 *     summary: Barcha viloyatlar ro'yxatini olish
 *     description: Ma'lumotlar bazasidagi barcha viloyatlarning ro'yxatini qaytaradi.
 *     tags:
 *       - Regionlar
 *     responses:
 *       200:
 *         description: Viloyatlar ro'yxati.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name_uz:
 *                     type: string
 *                     example: "Toshkent"
 *       500:
 *         description: Serverda xato yuz berdi.
 */
router.get("/viloyat", async function(req, res){

    try {
        let data = await pool.query("Select * from viloyat order by id");
        
        res.status(200).send(data.rows)
    } catch (error) {
        res.status(500).send({error : "Server error! :("});
        console.log(error)
    }


});

const Schema = Joi.object(
    {
        id : Joi.number().integer().min(0).max(15)
    }
);


router.get("/tuman/:id", async function(req, res){
    if(Schema.validate(req.params).error) return res.send(400).send(Schema.validate(req.params).error.message)

    try {
        const {id} = req.params;
        let data = await pool.query(`
            SELECT *, 
(Select count(*) from tuman where viloyat_id = $1) as all 
FROM tuman
where viloyat_id = $2
ORDER BY name_uz ASC `, [id, id]);

        res.status(200).send(data.rows)
    } catch (error) {
        res.status(500).send({error : "Server error! :("});
        console.log(error)
    }


});


/**
 * @swagger
 * /regions/tuman/{id}:
 *   get:
 *     summary: Ma'lum viloyat uchun barcha tumanlarni olish
 *     description: Berilgan viloyat ID'si asosida barcha tumanlarni ro'yxatini qaytaradi.
 *     tags:
 *       - Regionlar
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 15
 *         description: Tumanning viloyat ID raqami.
 *     responses:
 *       200:
 *         description: Tumanning viloyatlaridagi tumanlar ro'yxati.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name_uz:
 *                     type: string
 *                     example: "Yunusobod"
 *       400:
 *         description: ID parametri noto‘g‘ri.
 *       500:
 *         description: Serverda xato yuz berdi.
 */


export default router;