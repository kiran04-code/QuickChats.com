import express from "express"
const userroutes = express.Router()
import { checkAuth } from "../middleware/user.js"
import {createUser, Login,UpdateProfile,Logout, checkAuths} from "../controller/user.js"
userroutes.post("/signup",createUser)
userroutes.post("/signin",Login)
userroutes.put("/Update-Profile",checkAuth("access_Token"),UpdateProfile)
userroutes.get("/Logout",Logout)
userroutes.get("/checkAuths",checkAuths)

export default userroutes