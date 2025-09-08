import React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

function Register() {
  const primaryColor = "#F59E0B"; // Orange-900
  const hoverColor = "#FBBF24"; // Orange-800
  const bgColor = "#FFF9F6"; // Orange-50
  const borderColor = "#ddd"; // Light gray

  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/register`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
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
        <h2 className="text-2xl font-semibold mb-6">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <label className="block text-sm font-medium mb-1">
            Full Name
            <input
              type="text"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
              placeholder="Enter your full name"
              style={{ borderColor: borderColor }}
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              required
            />
          </label>

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

          <label className="block text-sm font-medium mb-1">
            Mobile Number
            <input
              type="tel"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
              placeholder="Enter your mobile number"
              style={{ borderColor: borderColor }}
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
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
          </label>

          <label className="block text-sm font-medium mb-1">
            Role
            <select
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
              style={{ borderColor: borderColor }}
              value={role}
              onChange={handleRoleChange}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="shipper">Shipper</option>
            </select>
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
            Register
          </button>

          <button
            type="button"
            className="w-full py-2 rounded-lg border font-semibold flex items-center justify-center cursor-pointer hover:bg-gray-100"
            style={{ borderColor: borderColor }}
          >
            <FcGoogle size={24} className="inline mr-2" /> Sign up with Google
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium"
            style={{ color: primaryColor }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
