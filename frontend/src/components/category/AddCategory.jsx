// import axios from "axios";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { serverUrl } from "../App";
// import { setCategoryies } from "../redux/slice/userSlice";
// import { IoMdArrowBack } from "react-icons/io";
// import { FaUtensils } from "react-icons/fa6";
// import { ClipLoader } from "react-spinners";

// function AddCategory() {
//     const {categories} = useSelector((state) => state.user); 
//     console.log("Categories:", categories);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const handleNavigateBack = () => navigate(-1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [backendImage, setBackendImage] = useState(null);
//   const [name, setName] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setBackendImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//     const handleSubmit = async (e) => {
//       setError(null);
//       e.preventDefault();
//       setLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append("name", name);
//         if (backendImage) {
//           formData.append("image", backendImage);
//         }
//         const res = await axios.post(
//           `${serverUrl}/api/category/create-category`,
//           formData,
//           {
//             withCredentials: true,
//           }
//         );
//         dispatch(setCategoryies(res.data));
//         setLoading(false);
//         navigate("/");
//       } catch (error) {
//         console.error(error);
//         // setError(error.response.data.message);
//         setLoading(false);
//       }
//     };
//   return (
//     <div className="flex justify-center items-center flex-col p-[24px] bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
//       <div
//         className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
//         onClick={handleNavigateBack}
//       >
//         <IoMdArrowBack
//           size={30}
//           className="text-[#F59E0B] hover:text-[#FBBF24]"
//         />
//       </div>
//       <div className="w-full shadow-xl max-w-lg rounded-xl bg-white p-[24px] border border-orange-100">
//         <div className="flex flex-col gap-6 p-6 bg-white max-w-md mx-auto">
//           <div className="flex flex-col gap-6 p-6 bg-white max-w-md mx-auto">
//             <div className="flex justify-center items-center bg-orange-100 rounded-full">
//               <FaUtensils size={50} className="text-[#F59E0B] w-full h-full" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Add Category</h1>
//             </div>
//           </div>

//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-1">
//               <label
//                 htmlFor="shopName"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Category Name
//               </label>
//               <input
//                 type="text"
//                 id="shopName"
//                 placeholder="Food Name"
//                 className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label
//                 htmlFor="image"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Category Image
//               </label>
//               <input
//                 type="file"
//                 id="image"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//               />
//             </div>
//             {imagePreview && (
//               <div className="mt-4">
//                 <img
//                   src={imagePreview}
//                   alt="Shop preview"
//                   className="w-full h-48 object-cover rounded-md border border-gray-300"
//                 />
//               </div>
//             )}
//             {error && <p className="text-red-500">{error}</p>}
//             <button
//               type="submit"
//               className="btn w-full bg-[#F59E0B] text-white py-2 rounded-md hover:bg-[#FBBF24] cursor-pointer transition font-semibold"
//             >
//               {loading ? <ClipLoader color="white" size={20} /> : "Save"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddCategory;

import React, { useState } from "react";
import axios from "axios";
import { FaUtensils } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setCategoryies } from "../../redux/slice/userSlice";
import { serverUrl } from "../../App";

function AddCategory({ onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState("");

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
        `${serverUrl}/api/category/create-category`,
        formData,
        { withCredentials: true }
      );
      console.log("Created Category:", res.data);
      dispatch(setCategoryies(res.data));
      setLoading(false);
      onClose(); // close modal after success
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message || "Error creating category. Try again."
      );
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
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
              {loading ? <ClipLoader color="#fff" size={20} /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
