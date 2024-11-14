import { Router } from "express";
import pool from "../../functions/database.js";
import { checktoken, getid } from "../../functions/jwtAdmin.js";
import logger from "../../functions/log.js";


const router = Router();

router.get("/", checktoken,  async function(req, res){
   try {
      
     let id = getid(req, res);
    

    const data = await pool.query(`SELECT 
        admin.login as admin_login,
        admin.firstname as admin_firstname,
        admin.lastname as admin_lastname,
		admin_role.name as adminName,
        viloyat.name_uz as viloyat_uz,
        viloyat.name_oz as viloyat_oz,
        viloyat.name_ru as viloyat_ru,
        tuman.name_uz as tuman_uz,
        tuman.name_oz as tuman_oz,
        tuman.name_ru as tuman_ru
        FROM admin
        inner join viloyat on admin.viloyat_id = viloyat.id
        inner join tuman on admin.tuman_id = tuman.id
		inner join admin_role on admin.role_id = admin_role.id
        where admin.id = $1;`,[id]);
        res.send(data.rows[0]);
        return
        
   } catch (err) {

console.log(err)
const errorObject = {
   message: err.message,      // Xato xabari
   name: err.name,            // Xato turi (Error nomi)
   stack: err.stack           // Stack trace (qo'shimcha ma'lumot)
};

console.log(errorObject); // Server log uchun
logger.error('Error Details:', errorObject);    
   }
});
export default router;

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: Get admin information
 *     description: Fetches detailed information about an admin based on their ID, including personal details and location.
 *     tags:
 *       - Admin Profili
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success - returns admin information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin_login:
 *                   type: string
 *                   description: Admin login username
 *                 admin_firstname:
 *                   type: string
 *                   description: Admin's first name
 *                 admin_lastname:
 *                   type: string
 *                   description: Admin's last name
 *                 admin_profil_url:
 *                   type: string
 *                   description: URL of the admin's profile image
 *                 viloyat_uz:
 *                   type: string
 *                   description: Viloyat name in Uzbek
 *                 viloyat_oz:
 *                   type: string
 *                   description: Viloyat name in Cyrillic Uzbek
 *                 viloyat_ru:
 *                   type: string
 *                   description: Viloyat name in Russian
 *                 tuman_uz:
 *                   type: string
 *                   description: Tuman name in Uzbek
 *                 tuman_oz:
 *                   type: string
 *                   description: Tuman name in Cyrillic Uzbek
 *                 tuman_ru:
 *                   type: string
 *                   description: Tuman name in Russian
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
 *       500:
 *         description: Internal Server Error
 */
