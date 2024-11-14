import Joi from "joi";
import { Router } from "express";
import { checktoken } from "../../../functions/jwtAdmin.js";
import pool from "../../../functions/database.js";
import { limiter } from "../../../functions/limiter.js";
const router = Router();

const Schema = Joi.object({
    id : Joi.number().integer().min(0).required()}
);

router.delete("/:id", [limiter, checktoken], async function (req, res, next) {
    const check = Schema.validate(req.params);
    if(check.error) return res.status(400).send({error : check.error.message})
        const { id } = req.params;
        try {
            let data = await pool.query(
                "update admin set state = false where id = $1 and struct = false", [id]
            );
            res.status(200).send({deleted : true});
            return;
        } catch (error) {
            res.status(500).send({deleted : "Server error"});

            console.log(error)
        }
})


export default router;
/**
 * @swagger
 * /admin/deleteadmin/{id}:
 *   delete:
 *     summary: Delete an admin user
 *     description: Marks an admin user as deleted by setting the `state` to false.
 *     tags:
 *       - Subadminni boshqarish
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the admin user to be deleted.
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       '200':
 *         description: Successfully deleted the admin user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       '400':
 *         description: Bad request, validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "id must be a number"
 *       '500':
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: string
 *                   example: "Server error"
 */