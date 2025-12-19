import React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { GoogleAuthProvider, signInWithPopup, deleteUser } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/userSlice";

function Login() {
  const primaryColor = "#F59E0B"; // Orange-900
  const hoverColor = "#FBBF24"; // Orange-800
  const bgColor = "#FFF9F6"; // Orange-50
  const borderColor = "#ddd"; // Light gray

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigateForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
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
      dispatch(setUserData(response.data.user));
      setLoading(false);
      setErr("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  // const handleGoogleLogin = async (e) => {
  //   e.preventDefault();
  //   setShowExtraInfo(false);
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const response = await signInWithPopup(auth, provider);
  //     const googleEmail = response.user.email;
  //     const emailResponse = await axios.get(
  //       `${serverUrl}/api/auth/get-user-email`
  //     );
  //     const existingEmails = emailResponse.data.map((item) => item.email);
  //     if (existingEmails.includes(googleEmail)) {
  //       const { data } = await axios.post(
  //         `${serverUrl}/api/auth/google-authen`,
  //         {
  //           email: response.user.email,
  //         },
  //         { withCredentials: true }
  //       );
  //       dispatch(setUserData(data.user));
  //     } else {
  //       setFullName(response.user.displayName);
  //       setEmail(response.user.email);
  //       setShowExtraInfo(true);
  //       return setErr(
  //         "Please enter your mobile number, password and role to complete registration."
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setErr("Google sign-in failed. Please try again.");
  //   }
  // };
  
    const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setShowExtraInfo(false);
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      const googleEmail = response.user.email;
    const { data: checkData } = await axios.get(
      `${serverUrl}/api/auth/check-email?googleEmail=${googleEmail}`,
      { withCredentials: true }
    );
      if (checkData.exists) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/google-authen`,
          {
            email: googleEmail,
          },
          { withCredentials: true }
        );
        dispatch(setUserData(data.user));
      } else {
        setFullName(response.user.displayName);
        setEmail(response.user.email);
        setShowExtraInfo(true);
        return setErr(
          "Please enter your mobile number, password and role to complete registration."
        );
      }
    } catch (error) {
      console.error(error);
      setErr("Google sign-in failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/register2`,
        {
          fullName,
          email,
          // password,
          mobile,
          role,
        },
        {
          withCredentials: true,
        }
      );
      console.log("response: ", response);
      setLoading(false);
      setErr("");
      setShowExtraInfo(false);
      dispatch(setUserData(response.data.user));
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  const handleCancel = () => {
    if (auth.currentUser) {
      deleteUser(auth.currentUser).then(() => {
        console.log("User deleted successfully");
      });
    }
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setMobile("");
    setShowExtraInfo(false);
    setErr("");
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
            <div
              className="flex justify-end mt-1"
              onClick={navigateForgotPassword}
            >
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800"
                style={{ color: primaryColor }}
              >
                Forgot password?
              </Link>
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
            disabled={loading}
          >
            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Login"}
          </button>

          {err && <p className="text-red-500 text-sm text-center">{err}</p>}

          <button
            type="button"
            className="w-full py-2 rounded-lg border font-semibold flex items-center justify-center cursor-pointer hover:bg-gray-100"
            style={{ borderColor: borderColor }}
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={24} className="inline mr-2" /> Sign in with Google
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Does not have an account?{" "}
          <Link
            to="/register"
            className="font-medium"
            style={{ color: primaryColor }}
          >
            Sign up
          </Link>
        </p>
      </div>
      {showExtraInfo && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCancel}
            >
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Enter your details</h2>
            {err && <p className="text-red-500 text-sm text-center">{err}</p>}

            <label className="block text-sm font-medium mb-2">
              Mobile
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
                placeholder="Enter your mobile number"
                style={{ borderColor: borderColor }}
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
                required
              />
            </label>

            <label className="block text-sm font-medium mb-2">
              Role
              <select
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: borderColor }}
                onChange={(e) => setRole(e.target.value)}
                value={role}
                required
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="shipper">Shipper</option>
              </select>
            </label>

            <button
              type="button"
              className="w-full mt-3 py-2 rounded-lg text-white font-semibold cursor-pointer"
              style={{ backgroundColor: primaryColor }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleRegister}
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : "Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
