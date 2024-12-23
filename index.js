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
        url : "http://192.168.137.208:4100/"
      },
      {
        url: "http://localhost:4100",
      },
      {
        url : "https://campus-backend-qxl2.onrender.com"
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
    "./Routers/admin/login.js",
    "./Routers/admin/CRUD Admin/add.js",
    "./Routers/admin/CRUD Admin/checker.js",
    "./Routers/admin/CRUD Admin/deleteadmin.js",
    "./Routers/admin/CRUD Admin/get.js",
    "./Routers/admin/profile.js",
    "./Routers/admin/changepasswordAdmin.js",
    "./Routers/admin/CRUD Admin/get_roles.js",
    "./Routers/admin/CRUD Admin/addRole.js",
    "./Routers/admin/CRUD Admin/EditRole.js.js",

    
    "./Routers/Admin/free data/*.js",
    // "./Routers/Admin/CRUD Admin/*.js",
    "./Routers/admin/student Groups/Crud Group/*.js",
    "./Routers/admin/student Groups/CRUD student/*.js",
        // // Admin rollari
        // // free regions

        "./Routers/admin/free data/regions.js",

        // Teachers uchun 
    "./Routers/admin/CRUD_Teacher/*.js"  ,
    
    

    // Teacher uchun Routerlar
    "./Routers/teacher/Auth/*.js"
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
import teacher from "./Routers/teacher/index.js"


admin.forEach(item=>app.use(`/admin/${item.path}`, item.component))
teacher.forEach(item=>app.use(`/teacher/${item.path}`, item.component))
dotenv.config();
const PORT = process.env.PORT || 4000;

let host = '192.168.137.208' || '192.168.20.102';
const server = http.createServer(app)
server.listen(PORT,  ()=>console.log(`Server is running:  http://${host}:${process.env.PORT}/api-docs` ));
export default app;