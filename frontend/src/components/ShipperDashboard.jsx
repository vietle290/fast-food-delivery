import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import ShipperTracking from "./ShipperTracking";

function ShipperDashboard() {
  const { userData } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  console.log("User Data:", currentOrder);

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-current-order`, {
        params: { userId: userData._id },
        withCredentials: true,
      });
      setCurrentOrder(res.data);
    } catch (error) {
      console.error("Error getting current order:", error);
    }
  };

  const handleAcceptOrder = async (assignmentId) => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/accept-assignment/${assignmentId}`,
        {
          params: { userId: userData._id },
          withCredentials: true,
        }
      );
      console.log("Order accepted:", res.data);
      await getCurrentOrder();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    getCurrentOrder();
  }, [userData]);

  useEffect(() => {
    const handleGetAssignments = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/get-shipper-assignments`,
          {
            params: { userId: userData._id },
            withCredentials: true,
          }
        );
        console.log("Assignments:", res.data);
        setOrders(res.data);
        return res.data;
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    if (userData && userData.role === "shipper") {
      handleGetAssignments();
    }
  }, [userData]);

  return (
    <div className="w-[100vw] h-[100vh] pt-[100px] flex flex-col items-center bg-[#FFF9F6]">
      <Nav />
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome, <span className="text-[#F59E0B]">{userData.fullName}</span>
        </h2>
        <p className="text-sm text-red-500 mt-2">
          Latitude: {userData.location.coordinates[1]}, Longitude:{" "}
          {userData.location.coordinates[0]}
        </p>
      </div>
      {!currentOrder && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md mt-6 p-6">
          <h3 className="text-base font-semibold text-gray-800">
            Available Orders
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No Available Orders</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order, index) => (
                <li
                  key={index}
                  className="p-4 rounded-lg shadow-sm border bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">
                        {order.shopName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Delivery Address: {order.deliveryAddress.text}
                      </p>

                      {/* Items */}
                      <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>

                      {/* Subtotal */}
                      <p className="text-sm font-semibold text-gray-800 mt-2">
                        total: ${order.subtotal}
                      </p>
                    </div>
                    <div className="flex flex-col items-end md:items-center">
                      <button
                        onClick={() => handleAcceptOrder(order.assignmentId)}
                        className="mt-3 px-4 py-2 bg-[#F59E0B] text-white rounded-lg shadow hover:bg-red-600 transition"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {currentOrder && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md mt-6 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Current Order
          </h3>
          <div className="p-4 rounded-lg shadow-sm border bg-gray-50">
            <h4 className="font-semibold text-sm text-gray-800">
              {currentOrder.shopName}
            </h4>
            <p className="text-sm font-semibold text-gray-800 mt-2">{currentOrder?.shop.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              Delivery Address: {currentOrder.deliveryAddress.text}
            </p>
            {/* Items */}
            <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
              {currentOrder.shopOrder.shopItems.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            {/* Subtotal */}
            <p className="text-sm font-semibold text-gray-800 mt-2">
              total: ${currentOrder.shopOrder.subtotal}
            </p>
          </div>
          <ShipperTracking data={currentOrder} />
        </div>
      )}
    </div>
  );
}

export default ShipperDashboard;
