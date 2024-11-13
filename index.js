import Express from "express";
import http from "http";
import { configDotenv } from "dotenv";
import cors from "cors";
import pool from "./functions/database.js";



configDotenv();
console.log(process.env.ServerPORT)
const app = Express();
const {ServerPORT} = process.env;

// Middlewares

app.use(cors());
app.use(Express.json());
app.use(Express.static("./static/"))


const server = http.createServer(app);


server.listen(ServerPORT, function(){
    console.log("Server ishga tushdi : ", ServerPORT);
});