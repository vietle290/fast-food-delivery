import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getToken from "../utils/token.js";
import { sendOtpEmail } from "../utils/mail.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "Mobile number must be at least 10 digits" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            mobile,
            role,
        });

        const token = await getToken(user._id);

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 7*24*60*60*1000 }); // 7 days

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = await getToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 3600000 });
        return res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'None' });
    return res.status(200).json({ message: "User logged out successfully" });
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const otp = Math.floor(Math.random() * 10000).toString();
        user.resetPasswordOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        user.isOtpVerified = false;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ 'message': error.message || 'Something went wrong' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (user.isOtpVerified) {
            return res.status(400).json({ message: "OTP already verified" });
        }
        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        user.isOtpVerified = true;
        user.resetPasswordOtp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ 'message': error.message || 'Something went wrong' });
    }    
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ 'message': error.message || 'Something went wrong' });
    }   
};

