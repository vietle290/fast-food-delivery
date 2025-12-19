import express from "express";
import { register, login, logout, sendOtp, verifyOtp, resetPassword, googleAuthen, getALlUserEmail, register2, checkUserEmail } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/register", (register));
authRouter.post("/register2", (register2));
authRouter.post("/login", (login));
authRouter.get("/logout", (logout));
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-authen", (googleAuthen));
authRouter.get("/get-user-email", getALlUserEmail);
authRouter.get("/check-email", checkUserEmail);

export default authRouter;