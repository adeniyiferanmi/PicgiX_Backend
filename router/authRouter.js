import { Router } from "express";
import { Login, SignUp, verifyToken } from "../controller/authController.js";
const authRouter = Router()

authRouter.post("/signup",SignUp)
authRouter.post("/login",Login)
authRouter.post("/verify-token",verifyToken)
export default authRouter