import login from "./login.js";
import profile from "./profile.js";
import change_password from "./changepasswordAdmin.js"


import addAdmin from "./CRUD Admin/add.js";
import hasadmin from "./CRUD Admin/checker.js";
import deleteadmin from "./CRUD Admin/deleteadmin.js"
import getadmin from "./CRUD Admin/get.js";
import  get_roles from "./CRUD Admin/get_roles.js";
import create_role from "./CRUD Admin/addRole.js";
import edit_role from "./CRUD Admin/EditRole.js";

import addGroupStudent from "./student Groups/Crud Group/add.js";
import editGroupEdit from "./student Groups/Crud Group/edit.js"

// Studentni qo'shish
import addstudent from "./student Groups/CRUD student/add.js"
import editstudent from "./student Groups/CRUD student/editstudent.js"
import getstudent from "./student Groups/CRUD student/getstudent.js"
import deleteStudent from "./student Groups/CRUD student/deleteStudent.js"

// teacher qo'shish
import addteacher from "./CRUD_Teacher/addTeacher.js"
import editteacher from "./CRUD_Teacher/editteacher.js"
export default [

    {path : "login", component : login},
    {path : "profile", component : profile},
    {path : "change-password", component : change_password},
    {path : "addadmin", component : addAdmin},
    {path : "hasadmin", component : hasadmin},
    {path : "deleteadmin", component : deleteadmin},
    {path : "getadmin", component : getadmin},
    {path : "get_roles", component : get_roles},
    {path : "create_role", component : create_role},
    {path : "edit_role", component : edit_role},

    {path : "addGroupStudent", component : addGroupStudent},
    {path : "editGroupStudent", component : editGroupEdit},

    {path : "addstudent", component : addstudent},
    {path : "editstudent", component : editstudent},
    {path : "getstudent", component : getstudent},
    {path : "deleteStudent", component : deleteStudent},

// teacher qo'shish
    {path : "addteacher", component : addteacher},
    {path : "editteacher", component : editteacher}
]