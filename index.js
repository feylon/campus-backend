import express from "express"
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi  from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";




// Functions
import pool from "./functions/database.js";



// global.pool = pool;
// (async ()=>{
    
//     try {
//        let data = await pool.query(`
        
//         ;Select * from admin;`);
//         console.log(data.rows)
//     } catch (error) {
//         console.log(error)
//     }
// })()



 

// Middlewares
const app = express();
// Middleware for error handling

  
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Swagger

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Campus",
      version: "1.0.0",
      description: "Campus uchun swagger",
    },
    servers: [
      {
      url : "https://campus-backend-qxl2.onrender.com"
      },
      {
        url: "http://localhost:4100",
      },

    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./Routers/Admin/*.js",
    "./Routers/Admin/CRUD Admin/*.js",
    "./Routers/admin/student Groups/Crud Group/*.js",
    "./Routers/admin/student Groups/CRUD student/*.js",
        // // Admin rollari
        // "./Routers/admin/login.js",
        // "./Routers/admin/CRUD Admin/add.js",
        // "./Routers/admin/CRUD Admin/checker.js",
        // "./Routers/admin/CRUD Admin/deleteadmin.js",
        // "./Routers/admin/CRUD Admin/get.js",
        // "./Routers/admin/profile.js",
        // "./Routers/admin/CRUD Admin/get_roles.js",
        // // free regions

        "./Routers/admin/free data/regions.js"
  ],
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Free router
import regions from "./Routers/admin/free data/regions.js"
app.use("/regions", regions);
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        status: 400,
        message: "Invalid JSON format",
        error: err.message,
      });
    }
    next(err);
  });



// Routers
import admin from "./Routers/admin/index.js"
import { url } from "inspector";



admin.forEach(item=>app.use(`/admin/${item.path}`, item.component))
dotenv.config();
const PORT = process.env.PORT || 3000;

let host = '10.10.11.93:51' || '192.168.20.102';
const server = http.createServer(app)
server.listen(PORT,  ()=>console.log(`Server is running:  ${host}:${process.env.PORT}` ));
export default app;