import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",    
  port: 465,   
  secure: true,
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASS,  
  },
  logger: true, // bật log
  debug: true,  // bật debug
});

// Verify kết nối SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verify Error:", error);
  } else {
    console.log("SMTP ready:", success);
  }
});

// Hàm gửi OTP chung
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Send email error:", err);
    throw err;
  }
};

// Gửi OTP cho reset password
export const sendOtpEmail = async (to, otp) => {
  const html = `<b>Your OTP is: ${otp}. Please do not share with anyone. It will expire in 5 minutes.</b>`;
  return sendEmail({ to, subject: "Your Password Reset OTP", html });
};

// Gửi OTP cho delivery
export const sendDeliveryOtpEmail = async (user, otp) => {
  const html = `<b>Your OTP is: ${otp}. Please do not share with anyone. It will expire in 5 minutes.</b>`;
  return sendEmail({ to: user.email, subject: "Delivery Verification OTP", html });
};
