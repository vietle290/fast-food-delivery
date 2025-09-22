import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../redux/slice/ownerSlice";
import { ClipLoader } from "react-spinners";

function AddItem() {
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate(-1);
  const [imagePreview, setImagePreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Veg");
  const [loading, setLoading] = useState(false);
  const categories = [
    "Burgers and Fries",
    "Pizza",
    "Fried Chicken",
    "Tacos and Mexican Food",
    "Sandwiches and Subs",
    "Hot Dogs",
    "Seafood (e.g., Fish and Chips)",
    "Asian Fusion (e.g., Chinese, Japanese takeout)",
    "Breakfast Items (e.g., Muffins, Burritos)",
    "Salads and Healthy Options",
    "Ice Cream and Desserts",
    "Coffee and Beverages",
    "Donuts and Pastries",
    "Wraps and Pitas",
    "Barbecue and Grilled Meats",
    "All",
  ];
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const dispatch = useDispatch();

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
      formData.append("category", category);
      formData.append("type", type);
      formData.append("price", price);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post(
        `${serverUrl}/api/item/create-item`,
        formData,
        {
          withCredentials: true,
        }
      );
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
              <h1 className="text-3xl font-bold text-gray-800">Add Food</h1>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="shopName"
                className="text-sm font-medium text-gray-700"
              >
                Food Name
              </label>
              <input
                type="text"
                id="shopName"
                placeholder="Food Name"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Price"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Select Category
              </label>
              <select
                id="category"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="type"
                className="text-sm font-medium text-gray-700"
              >
                Select Food Type
              </label>
              <select
                id="type"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Veg">Vegetarian</option>
                <option value="Non-veg">Non-Vegetarian</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Food Image
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
            >
              {loading ? <ClipLoader color="white" size={20} /> : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
