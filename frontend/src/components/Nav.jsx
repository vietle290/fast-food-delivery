import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/slice/userSlice";

function Nav() {
  const { userData, location } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#FFF9F6] overflow-visible">
      {showSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[82px] left-[5%] md:hidden">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#F59E0B]" />
            <div className="w-[80%] truncate text-gray-600">{location}</div>
          </div>
          <div className="flex items-center w-[70%] gap-[10px] px-[10px]">
            <IoIosSearch size={25} className="text-gray-400" />
            <input
              type="text"
              placeholder="search food..."
              className="w-full px-[10px] text-gray-700 outline-0"
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-[#F59E0B]">Fast Food</h1>
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={25} className="text-[#F59E0B]" />
          <div className="w-[80%] truncate text-gray-600">{location}</div>
        </div>
        <div className="flex items-center w-[70%] gap-[10px] px-[10px]">
          <IoIosSearch size={25} className="text-gray-400" />
          <input
            type="text"
            placeholder="search food..."
            className="w-full px-[10px] text-gray-700 outline-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-[20px]">
        {showSearch ? (
          <RxCross2
            size={25}
            className="text-gray-400 md:hidden cursor-pointer"
            onClick={() => setShowSearch(false)}
          />
        ) : (
          <IoIosSearch
            size={25}
            className="text-gray-400 md:hidden cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        )}

        <div className="relative cursor-pointer">
          <FiShoppingCart size={25} className="text-[#F59E0B]" />
          <span className="absolute top-[-13px] right-[-8px] text-[#F59E0B]">
            0
          </span>
        </div>
        <button className="rounded-lg md:block hidden text-[#F59E0B]">
          My Orders
        </button>
        <div
          className="w-[40px] h-[40px] rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-xl font-bold cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {userData?.fullName.slice(0, 1).toUpperCase()}
        </div>
        {isDropdownOpen && (
          <div className="fixed top-[80px] right-[10px] w-[181px] bg-white shadow-lg rounded-lg p-[20px] flex flex-col gap-[20px] z-[9999] md:right-[10%] lg:right-[20%]">
            <div className="w-full flex flex-col gap-[5px]">
              <div className="text-lg font-semibold">{userData?.fullName}</div>
              <div className="text-md font-semibold text-[#F59E0B] md:hidden cursor-pointer">
                My Orders
              </div>
              <div
                className="text-md font-semibold cursor-pointer text-[#F59E0B]"
                onClick={handleLogout}
              >
                Log out
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
