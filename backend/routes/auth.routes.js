import express from "express";
import { register, login, logout, sendOtp, verifyOtp, resetPassword, googleAuthen, getALlUserEmail, register2 } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", (register));
router.post("/register2", (register2));
router.post("/login", (login));
router.get("/logout", (logout));
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/google-authen", (googleAuthen));
router.get("/get-user-email", getALlUserEmail);

export default router;