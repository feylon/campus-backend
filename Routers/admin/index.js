import login from "./login.js";
import profile from "./profile.js"
import addAdmin from "./CRUD Admin/add.js"
import hasadmin from "./CRUD Admin/checker.js"
import deleteadmin from "./CRUD Admin/deleteadmin.js"
import getadmin from "./CRUD Admin/get.js"
import  get_roles from "./CRUD Admin/get_roles.js";
import create_role from "./CRUD Admin/addRole.js";
import edit_role from "./CRUD Admin/EditRole.js"
export default [

    {path : "login", component : login},
    {path : "profile", component : profile},
    {path : "addadmin", component : addAdmin},
    {path : "hasadmin", component : hasadmin},
    {path : "deleteadmin", component : deleteadmin},
    {path : "getadmin", component : getadmin},
    {path : "get_roles", component : get_roles},
    {path : "create_role", component : create_role},
    {path : "edit_role", component : edit_role}
]