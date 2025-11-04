import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/user/UserOrderCard";
import OwnerOrderCard from "../components/owner/OwnerOrderCard";
import { useEffect } from "react";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/slice/userSlice";

function MyOrders() {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    socket?.on("newOrder", (data) => {

      
      if (data.shopOrders[0]?.owner?._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));

      }
    })
    socket?.on("update-status", ({ orderId, shopId, status, userId, assignment }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status, assignment }));
      }
    })
    return () => {
      socket?.off("newOrder")
      socket?.off("update-status")
    };
  }, [socket, dispatch, myOrders, userData._id]);

  const handleNavigateBack = () => {
    navigate(-1);
  };
  return (
    <div className="w-full min-h-[80vh] flex justify-center bg-[#FFF9F6]">
      <div className="w-full max-w-4xl p-4">
        <div className="flex items-center mb-6">
          <div className="cursor-pointer" onClick={handleNavigateBack}>
            <IoMdArrowBack
              size={30}
              className="text-[#F59E0B] hover:text-[#FBBF24]"
            />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-800">
            My Orders
          </h2>
        </div>

        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData.role == "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role == "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
