import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { FaStore } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { FaUtensils } from "react-icons/fa6";
import FoodCard from "../components/FoodCard";
import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { BsChatDots } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

function Shop() {
  const { userData, cartItems } = useSelector((state) => state.user);
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();
  const handleShop = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/item/get-item-by-shop/${shopId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setItems(res.data.items);
      setShop(res.data.shop);
    } catch (error) {
      console.log(error);
    }
  };

  const startChat = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/chat/conversation`,
        {
          buyerId: userData._id,
          ownerId: shop.owner,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/chat", {
        state: { conversation: res.data },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <button
        className="fixed top-4 left-4 bg-[#F59E0B] text-white py-1 px-2 rounded-full hover:bg-[#FBBF24] transition-colors duration-300 z-20"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowBack size={25} />
      </button>
      {userData && userData.role === "user" && (
        <div
          className="fixed top-5 right-5 cursor-pointer z-20"
          onClick={() => navigate("/cart-page")}
        >
          <FiShoppingCart size={25} className="text-[#F59E0B]" />

          {cartItems.length > 0 ? (
            <span className="absolute -top-2 -right-2 text-white rounded-full bg-[#f50b0b] px-[7px] text-xs">
              {cartItems.length}
            </span>
          ) : (
            <span className="absolute -top-2 -right-2 text-[#F59E0B] px-[5px] text-xs">
              0
            </span>
          )}
        </div>
      )}

      {shop && (
        <div className="w-full h-65 md:h-80 lg:h-92 relative">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col text-center items-center justify-center">
            <FaStore className="text-3xl mb-4 sm:text-4xl" />
            <h1 className="text-3xl font-bold">{shop.name}</h1>
            <div className="flex items-center mt-2 gap-1">
              <MdLocationOn className="text-7xl sm:text-5xl" color="#F59E0B" />
              <p className="text-sm sm:text-lg font-medium text-gray-300">
                {shop.address}
              </p>
            </div>

            <button
              onClick={startChat}
              className="mt-6 bg-[#F59E0B] hover:bg-[#FBBF24] text-white px-6 py-2 rounded-lg"
            >
              <BsChatDots size={25} className="text-white" />
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-800 gap-3 mb-10 flex items-center justify-center">
          <FaUtensils className="text-2xl mr-2" color="#F59E0B" />
          Menu
        </h2>
        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item, index) => (
              <FoodCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-4">No items found</p>
        )}
      </div>
    </div>
  );
}

export default Shop;
