import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/database.js";
import { check, hashpassword } from "../../../functions/bcrypt.js";
import { checktoken, getid } from "../../../functions/jwtTeacher.js";

const router = Router();

router.get("/", checktoken, async (req, res) => {
    try {
      
        let id = getid(req, res);
       
   
       const data = await pool.query(`
        Select 
teacher.email as email,
teacher.login as login,
teacher.firstname as firstname,
teacher.lastname as lastname,
teacher.parent_name as parent_name, 
teacher.brithday as birthday,
teacher.viloyat_id as viloyat_id,
teacher.tuman_id as tuman_id,
v.name_uz as viloyat,
t.name_uz as tuman,
teacher.address as address

from teacher
inner join viloyat v on v.id = teacher.viloyat_id
inner join tuman t on t.id = teacher.tuman_id
where teacher.id = $1 and teacher.state 
;
        ;`,[id]);
           res.send(data.rows[0]);
           return
           
      } catch (err) {
   
console.log("error : ", err);
        res.status(500).send({error : "Server error"})
      }

});

export default router;