import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUtensils } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryies,
  setSearchCategories,
} from "../../redux/slice/userSlice";
import { serverUrl } from "../../App";

function UpdateCategory({ onClose, category }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState("");
  const { searchCategories, categories } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/category/update-category/${category._id}`,
        formData,
        { withCredentials: true }
      );
    if (searchCategories.length > 0) {
      dispatch(setSearchCategories(res.data));
    } else {
      dispatch(setCategoryies(res.data));
    }
      setLoading(false);
      onClose(); // close modal after success
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message || "Error updating category. Try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImagePreview(category.image);
    }
  }, [category]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-lg p-6 shadow-2xl relative border border-orange-100 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="flex justify-center items-center bg-orange-100 rounded-full w-20 h-20">
            <FaUtensils size={40} className="text-[#F59E0B]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Update Category</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Healthy Food, Drinks, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F59E0B] focus:outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F59E0B] focus:outline-none transition"
            />
          </div>

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-medium text-center mt-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#F59E0B] hover:bg-[#FBBF24] text-white rounded-md font-semibold transition"
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCategory;
