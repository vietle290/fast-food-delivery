import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/user/UserOrderCard";
import OwnerOrderCard from "../components/owner/OwnerOrderCard";
import { useEffect } from "react";
import {
  setMyOrders,
  updateRealtimeOrderStatus,
} from "../redux/slice/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedStatus, setSelectedStatus] = useState("pending");

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrders[0]?.owner?._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });
    socket?.on(
      "update-status",
      ({ orderId, shopId, status, userId, assignment }) => {
        if (userId == userData._id) {
          dispatch(
            updateRealtimeOrderStatus({ orderId, shopId, status, assignment })
          );
        }
      }
    );
    return () => {
      socket?.off("newOrder");
      socket?.off("update-status");
    };
  }, [socket, dispatch, myOrders, userData._id]);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const filteredOrders = myOrders
    ?.map((order) => {
      const filteredShopOrders = order.shopOrders.filter(
        (shopOrder) => shopOrder.status === selectedStatus
      );

      return filteredShopOrders.length > 0
        ? { ...order, shopOrders: filteredShopOrders }
        : null;
    })
    .filter(Boolean); // remove null

  const tabs = ["pending", "preparing", "out-for-delivery", "delivered"];

  console.log("myOrders in MyOrders page:", filteredOrders);

  return (
    <div className="w-full min-h-[80vh] flex justify-center bg-[#FFF9F6] px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-2 sm:p-4 md:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="cursor-pointer" onClick={handleNavigateBack}>
            <IoMdArrowBack
              size={24}
              className="text-[#F59E0B] hover:text-[#FBBF24] sm:text-2xl"
            />
          </div>
          <h2 className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-800">
            My Orders
          </h2>
        </div>

        <div className="flex flex-wrap justify-between bg-white shadow-md rounded-xl p-2 sm:p-3 mb-4 sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-1 py-2 rounded-lg text-sm font-semibold capitalize
                ${
                  selectedStatus === tab
                    ? "bg-[#F59E0B] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) =>
              userData.role === "user" ? (
                <UserOrderCard
                  data={order}
                  selectedStatus={selectedStatus}
                  key={index}
                />
              ) : userData.role === "owner" ? (
                <OwnerOrderCard
                  data={order}
                  selectedStatus={selectedStatus}
                  key={index}
                />
              ) : null
            )
          ) : (
            <p className="text-center text-gray-500 mt-10">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
