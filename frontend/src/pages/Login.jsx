import React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function Login() {
  const primaryColor = "#F59E0B"; // Orange-900
  const hoverColor = "#FBBF24"; // Orange-800
  const bgColor = "#FFF9F6"; // Orange-50
  const borderColor = "#ddd"; // Light gray

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigateForgotPassword = () => {
    navigate('/forgot-password');
  }

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("response: ", response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
          Fast Food
        </h1>
        <h2 className="text-2xl font-semibold mb-6">Login to your account</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block text-sm font-medium mb-1">
            Email
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
              placeholder="Enter your email"
              style={{ borderColor: borderColor }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </label>

          <label className="block text-sm font-medium mb-1 relative">
            Password
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
              placeholder="Enter your password"
              style={{ borderColor: borderColor }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-sm text-gray-600"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
            <div className="flex justify-end mt-1"  onClick={navigateForgotPassword}>
              <a
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800"
                style={{ color: primaryColor }}
              >
                Forgot password?
              </a>
            </div>
          </label>

          <button
            type="submit"
            className="w-full mt-3 py-2 rounded-lg text-white font-semibold cursor-pointer"
            style={{ backgroundColor: primaryColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
          >
            Login
          </button>

          <button
            type="button"
            className="w-full py-2 rounded-lg border font-semibold flex items-center justify-center cursor-pointer hover:bg-gray-100"
            style={{ borderColor: borderColor }}
          >
            <FcGoogle size={24} className="inline mr-2" /> Sign in with Google
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Does not have an account?{" "}
          <a
            href="/register"
            className="font-medium"
            style={{ color: primaryColor }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
