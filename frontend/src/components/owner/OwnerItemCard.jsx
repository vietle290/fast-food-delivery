import React from "react";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { useDispatch } from "react-redux";
import { setShopData } from "../../redux/slice/ownerSlice";
import axios from "axios";

function OwnerItemCard({ item }) {
  const { name, type, price, image } = item || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigateUpdate = () => navigate(`/update-item/${item._id}`);
  const handleDeleteItem = async (itemId) => {
    try {
      const res = await axios.get(`${serverUrl}/api/item/delete-item/${itemId}`, {
        withCredentials: true,
      });
      dispatch(setShopData(res.data));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#F59E0B] w-full max-w-2xl">
      <img
        src={
          image ||
          "https://img.favpng.com/24/21/9/food-icon-thanksgiving-fill-icon-food-icon-png-favpng-3mbb5g1Ubhi7EHPpjELypuBpn.jpg"
        }
        alt={name}
        className="w-32 h-full flex-shrink-0 object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {name || "Food Name"}
            </h2>
            <p className="text-sm text-gray-600">{type || "Food Type"}</p>
            <p className="text-sm text-gray-600">
              {item.category?.name || "Food Category"}
            </p>
          </div>
          <div>
            <p className="text-md font-semibold text-[#F59E0B]">
              {price || "0.00"} vnd
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-2">
          <button
            onClick={handleNavigateUpdate}
            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            aria-label="Update"
          >
            <MdEdit size={20} />
          </button>
          <button
            onClick={() => handleDeleteItem(item._id)}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            aria-label="Delete"
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
