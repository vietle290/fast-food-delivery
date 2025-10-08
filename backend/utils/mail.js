import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
    logger: true,
    debug: true,
  },
});

// verify connection configuration
transporter
  .verify()
  .then(() => {
    console.log("SMTP ready");
  })
  .catch((err) => {
    console.error("Verify error:", err);
  });

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Your Password Reset OTP",
    html: `<b>Your OTP is: <b>${otp}</b>. Please do not share with anyone. It will expire in 5 minutes</b>`,
  });
};

export const sendDeliveryOtpEmail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery verification OTP",
    html: `<b>Your OTP is: <b>${otp}</b>. Please do not share with anyone. It will expire in 5 minutes</b>`,
  });
};