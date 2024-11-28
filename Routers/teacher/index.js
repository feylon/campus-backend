// Login
import login from "./Auth/login.js";
import change_password from "./Auth/changepassword.js"
import profile from "./Auth/Profile.js"
export default [
    // login
    {path : "login", component : login},
    {path : "change_password", component : change_password},
    {path : "profile", component : profile}
]