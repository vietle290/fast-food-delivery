import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import ShipperTracking from "./ShipperTracking";
import { ClipLoader } from "react-spinners";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function ShipperDashboard() {
  const { userData, socket } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [shipperLocation, setShipperLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket || userData.role !== "shipper") return;
    console.log("socket connected");
    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => { //Live tracking
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setShipperLocation({ latitude, longitude });
        socket.emit("update-location", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, userData]);
  
  const ratePerDelivery = 50; // Example rate per delivery
  const totalEarnings = todayDeliveries.reduce((acc, curr) => acc + curr.count * ratePerDelivery, 0);

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
      await getCurrentOrder();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        {
          params: { userId: userData._id },
          withCredentials: true,
        }
      );
      setLoading(false);
      setShowOtpBox(true);
    } catch (error) {
      setLoading(false);
      console.error("Error accepting order:", error);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: otp,
        },
        {
          params: { userId: userData._id },
          withCredentials: true,
        }
      );
      setLoading(false);
      setShowOtpBox(false);
      location.reload();
    } catch (error) {
      setLoading(false);
      console.error("Error accepting order:", error);
    }
  };

    const handleTodayDeliveries = async () => {

    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        {
          params: { userId: userData._id },
          withCredentials: true,
        }
      );
      console.log(res.data);
      setTodayDeliveries(res.data);
      return res.data;
    } catch (error) {
      console.error("Error get today deliveries:", error);
    }
  };

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

  useEffect(() => {
    socket?.on("new-assignment", (data) => {
      if (data.sendTo == userData._id) {
        setOrders((prevOrders) => [...prevOrders, data]);
      }
    });
    return () => {
      socket?.off("new-assignment");
    };
  }, [socket]);

  useEffect(() => {
    if (!userData) return;
    handleTodayDeliveries();
    getCurrentOrder();
  }, [userData]);

  return (
    <div className="w-[100vw] h-auto pt-[100px] flex flex-col items-center bg-[#FFF9F6] pb-[100px]">
      <Nav />
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome, <span className="text-[#F59E0B]">{userData.fullName}</span>
        </h2>
        <p className="text-sm text-red-500 mt-2">
          Latitude: {shipperLocation?.latitude}, Longitude:{" "}
          {shipperLocation?.longitude}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-5 mt-2 w-full max-w-2xl mb-6 border border-orange-100">
        <h1 className="text-lg font-bold text-[#F59E0B]">Today Deliveries</h1>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={todayDeliveries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
            <YAxis dataKey="count" allowDecimals={false} />
            <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`}/>
            <Bar dataKey="count" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>

        <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Today Earning</h1>
          <span className="text-3xl font-bold text-green-600">${totalEarnings}</span>
        </div>
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
            <p className="text-sm font-semibold text-gray-800 mt-2">
              {currentOrder?.shop.name}
            </p>
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
          <ShipperTracking
            data={{
              shipperLocation: shipperLocation || {
                latitude: userData.location.coordinates[1],
                longitude: userData.location.coordinates[0],
              },
              customerLocation: {
                latitude: currentOrder.deliveryAddress.latitude,
                longitude: currentOrder.deliveryAddress.longitude,
              },
            }}
          />
          {!showOtpBox && !loading ? (
            <button
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              onClick={sendOtp}
              disabled={loading}
            >
              Mark As Delivered
            </button>
          ) : !showOtpBox && loading ? (
            <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition" disabled>
              <ClipLoader size={20} color={"#F59E0B"} />
            </button>
          ) : (
            <div className="mt-4 flex flex-col items-center">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={verifyOtp}
                className="mt-4 w-full px-4 py-2 bg-[#F59E0B] text-white rounded-lg shadow hover:bg-[#FBBF24] transition"
              >
                Submit OTP
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShipperDashboard;
