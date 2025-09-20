import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../redux/slice/ownerSlice";
import { ClipLoader } from "react-spinners";

function CreateUpdateShop() {
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate(-1);
  const { shopData } = useSelector((state) => state.owner);
  const [imagePreview, setImagePreview] = useState(shopData ? shopData.image : null);
  const [backendImage, setBackendImage] = useState(null);
  const { currentState, location, currentAddress } = useSelector((state) => state.user);
  const [name, setName] = useState(shopData ? shopData.name : "");
  const [city, setCity] = useState(shopData ? shopData.city : location);
  const [address, setAddress] = useState(shopData ? shopData.address : currentAddress);
  const [state, setState] = useState(shopData ? shopData.state : currentState);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("state", state);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post(`${serverUrl}/api/shop/create-update-restaurant`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      dispatch(setShopData(res.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col p-[24px] bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={handleNavigateBack}
      >
        <IoMdArrowBack
          size={30}
          className="text-[#F59E0B] hover:text-[#FBBF24]"
        />
      </div>
      <div className="w-full shadow-xl max-w-lg rounded-xl bg-white p-[24px] border border-orange-100">
        <div className="flex flex-col gap-6 p-6 bg-white max-w-md mx-auto">
          <div className="flex flex-col gap-6 p-6 bg-white max-w-md mx-auto">
            <div className="flex justify-center items-center bg-orange-100 rounded-full">
              <FaUtensils size={50} className="text-[#F59E0B] w-full h-full" />
            </div>
            <div>
              {shopData ? (
                <h1 className="text-3xl font-bold text-gray-800">
                  Update Shop
                </h1>
              ) : (
                <h1 className="text-3xl font-bold text-gray-800">
                  Create Shop
                </h1>
              )}
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="shopName"
                className="text-sm font-medium text-gray-700"
              >
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                placeholder="Shop Name"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="city"
                className="text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                placeholder="City"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="state"
                className="text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                placeholder="State"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Address"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Shop Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Shop preview"
                  className="w-full h-48 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
            <button
              type="submit"
              className="btn w-full bg-[#F59E0B] text-white py-2 rounded-md hover:bg-[#FBBF24] cursor-pointer transition font-semibold"
              disabled={loading}
            >
              {loading ? <ClipLoader color="white" size={20} /> : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUpdateShop;
