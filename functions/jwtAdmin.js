import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();

const sign = function (id) {
  return jwt.sign({ id }, "salom", { expiresIn: "1d" });
};

function checktoken(req, res, next) {
  if(!req.headers.authorization) return res.status(401).send({error : "Bearer token mavjud emas"})
  const  token = req.headers.authorization.split(' ')[1]
  try {
  let i =  jwt.verify(token, process.env.JWT);
   
  next();
  } catch (err) {
    return res.status(401).send({ error: "Error token" });
  }
  
}
function getid (req, res){
  if(!req.headers.authorization) return res.status(401).send({error : "Bearer token mavjud emas"})
    const  token = req.headers.authorization.split(' ')[1]
    try {
    let i =  jwt.verify(token, process.env.JWT);
    return i.id;  
    
    } catch (err) {
      return res.status(401).send({ error: "Error token" });
    }
    
  
}


export  { sign, checktoken, getid};
