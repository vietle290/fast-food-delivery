import axios from "axios";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleStep = () => {
    setStep(step - 1);
    if (step == 1) window.location.href = "/login";
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true }
      );
      console.log("response: ", response);
      setStep(2);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      console.log("response: ", response);
      setStep(3);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return null;
    }
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      console.log("response: ", response);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#FFF9F6" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center mb-6 gap-2">
          <IoIosArrowRoundBack
            className="text-2xl text-gray-700 cursor-pointer hover:text-gray-500 mt-0.5"
            onClick={handleStep}
          />
          <h2 className="text-2xl font-semibold text-center text-[#F59E0B]">
            Forgot Password
          </h2>
        </div>
        {step === 1 && (
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="mt-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-white py-2 px-4 rounded cursor-pointer"
              onClick={handleSendOtp}
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label
              htmlFor="otp"
              className="block text-gray-700 font-semibold mb-2"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="mt-4 bg-[#F59E0B] hover:bg-[#FBBF24] text-white py-2 px-4 rounded cursor-pointer"
              onClick={handleVerifyOtp}
            >
              Next
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded cursor-pointer" onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
