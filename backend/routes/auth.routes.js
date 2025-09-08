import express from "express";
import { register, login, logout, sendOtp, verifyOtp, resetPassword } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", (register));
router.post("/login", (login));
router.post("/logout", (logout));
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;