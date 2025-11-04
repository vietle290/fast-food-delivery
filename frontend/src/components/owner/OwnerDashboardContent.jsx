import React from "react";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import OwnerItemCard from "./OwnerItemCard";
import { useNavigate } from "react-router-dom";

function OwnerDashboardContent() {
  const { shopData } = useSelector((state) => state.owner);
  console.log("OwnerDashboardContent shopData:", shopData);
  const navigate = useNavigate();

  const handleNavigateCreateUpdateShop = () => navigate("/create-update-shop");
  const handleNavigateAddFood = () => navigate("/add-item");

  if (!shopData)
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border">
          <div className="flex flex-col items-center text-center gap-4">
            <FaUtensils size={50} className="text-[#F59E0B]" />
            <h1 className="text-2xl font-bold">No Shop</h1>
            <p className="text-gray-600">You have not added a shop yet.</p>
            <button
              onClick={handleNavigateCreateUpdateShop}
              className="bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-lg px-4 flex flex-col items-center">
      <div className="w-full bg-white rounded-lg shadow-lg flex flex-col items-center gap-4 relative pb-4">
        {shopData.image && (
          <img
            src={shopData.image}
            alt={shopData.name}
            className="w-full h-48 object-cover rounded-tl-md rounded-tr-md"
          />
        )}
        <h1 className="text-2xl sm:text-3xl flex items-center gap-3 text-gray-500">
          <FaUtensils size={50} className="text-[#F59E0B]" />
          {shopData.name}
        </h1>
        <p className="text-gray-600 text-center">{shopData.address}</p>
        <button
          onClick={handleNavigateCreateUpdateShop}
          className="bg-[#F59E0B] text-white p-2 rounded-full absolute top-4 right-4 hover:bg-[#FBBF24]"
        >
          <MdEdit size={25} />
        </button>
      </div>

      {shopData.items.length === 0 ? (
        <div className="flex justify-center items-center p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border">
            <div className="flex flex-col items-center text-center gap-4">
              <FaUtensils size={50} className="text-[#F59E0B]" />
              <h1 className="text-2xl font-bold">No Foods</h1>
              <p className="text-gray-600">You have not added a food yet.</p>
              <button
                onClick={handleNavigateAddFood}
                className="bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24]"
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4 mt-3 mb-3">
          {shopData.items.map((item, i) => (
            <OwnerItemCard key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboardContent;
