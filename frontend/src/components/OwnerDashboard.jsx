import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const handleNavigateCreateUpdateShop = () => navigate("/create-update-shop");
  const handleNavigateAddFood = () => navigate("/add-item");

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center bg-[#FFF9F6]">
      <Nav />
      {!shopData && (
        <div className="flex justify-center items-center p-[1rem] sm:p-[1.5rem]">
          <div className="w-full max-w-md shadow-lg rounded-xl bg-white p-[24px] border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <FaUtensils size={50} className="text-[#F59E0B]" />
              <h1 className="text-2xl font-bold">No Shop</h1>
              <p className="text-gray-600">You have not added a shop yet.</p>
              <button
                className="bg-[#F59E0B] text-white py-2 px-4 rounded-md hover:bg-[#FBBF24] transition-colors duration-300"
                onClick={handleNavigateCreateUpdateShop}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {shopData && (
        <div className="w-[100vw] px-4 sm:px-6 gap-6 flex flex-col items-center bg-[#FFF9F6]">
          <h1 className="text-2xl sm:text-3xl flex items-center text-center gap-3 text-gray-500">
            {" "}
            <FaUtensils size={50} className="text-[#F59E0B] w-14 h-14" />
            {shopData.name}
          </h1>
        </div>
      )} */}
      {shopData && (
        <div className="w-[100vw] px-4 sm:px-6 flex flex-col items-center bg-[#FFF9F6]">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg flex flex-col items-center gap-4 relative pb-4">
            {shopData.image && (
              <img
                src={shopData.image}
                alt={`${shopData.name} image`}
                className="w-full h-48 object-cover rounded-tl-md rounded-tr-md"
              />
            )}
            <h1 className="text-2xl sm:text-3xl flex items-center text-center gap-3 text-gray-500">
              <FaUtensils size={50} className="text-[#F59E0B] w-14 h-14" />
              {shopData.name}
            </h1>
            <p className="text-gray-600 text-center">{shopData.address}</p>
            <button
              className="bg-[#F59E0B] text-white py-1 px-1 rounded-full hover:bg-[#FBBF24] transition-colors duration-300 absolute top-4 right-4 hover:scale-110 cursor-pointer"
              onClick={handleNavigateCreateUpdateShop}
            >
              <MdEdit size={25} className="text-white" />
            </button>
          </div>
          {shopData.items.length == 0 && (
            <div className="flex justify-center items-center p-[1rem] sm:p-[1.5rem]">
              <div className="w-full max-w-md shadow-lg rounded-xl bg-white p-[24px] border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center gap-4">
                  <FaUtensils size={50} className="text-[#F59E0B]" />
                  <h1 className="text-2xl font-bold">No Foods</h1>
                  <p className="text-gray-600">
                    You have not added a food yet.
                  </p>
                  <button
                    className="bg-[#F59E0B] text-white py-2 px-4 rounded-md hover:bg-[#FBBF24] transition-colors duration-300"
                    onClick={handleNavigateAddFood}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}
          {shopData.items.length > 0 && (
            <div className="w-full max-w-lg flex flex-col items-center gap-4 mt-3 mb-3">
              {shopData.items.map((item, index) => (
                <OwnerItemCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
