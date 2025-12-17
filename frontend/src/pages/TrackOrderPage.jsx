import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import ShipperTracking from "../components/shipper/ShipperTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState();
  const { socket } = useSelector((state) => state.user);
  const [liveLocation, setLiveLocation] = useState({});
  const handleGetOrder = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      console.log("order data:", res.data);
      setOrderData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "update-shipper-location",
      ({ shipperId, latitude, longitude }) => {
          setLiveLocation((prev) => ({
            ...prev,
            [shipperId]: {
              latitude,
              longitude,
            },
          }));
        }
    );
    return () => {
      socket.off("update-shipper-location");
    };
  }, [socket]);

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4 ">
      <div
        className="flex items-center relative z-[10] cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowBack size={30} className="text-[#F59E0B]" />
        <span className="ml-2 text-2xl font-semibold">Back</span>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6">Track Order</h1>
      {orderData?.shopOrders?.map((shopOrder, index) => (
        <div key={index} className="border p-4 rounded-lg shadow">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#F59E0B]">
              {shopOrder.shop.name}
            </h2>
            <ul className="space-y-2 list-disc list-inside text-gray-500">
              {shopOrder.shopItems?.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <hr className="my-4 text-gray-400" />
            <p className="flex justify-end">
              <span className="font-semibold">Total: </span>$
              {shopOrder.subtotal}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Delivery Address:</span>{" "}
              {orderData.deliveryAddress?.text}
            </p>
            {shopOrder.status === "delivered" ? (
              <p className="mt-2 text-green-600 font-semibold">
                Status:{" "}
                {shopOrder.status.charAt(0).toUpperCase() +
                  shopOrder.status.slice(1)}
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {shopOrder.assignedShipper ? (
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Shipper: </span>
                      {shopOrder.assignedShipper.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Mobile: </span>
                      {shopOrder.assignedShipper.mobile}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-600 font-semibold">
                    Shipper Not Assigned Yet
                  </p>
                )}
                <p className="text-[#F59E0B] font-semibold">
                  Status:{" "}
                  {shopOrder.status.charAt(0).toUpperCase() +
                    shopOrder.status.slice(1)}
                </p>
              </div>
            )}
          </div>
          <div className="w-full rounded-2xl overflow-hidden shadow-md">
            {shopOrder.assignedShipper && shopOrder.status !== "delivered" && (
              <ShipperTracking
                data={{
                  shipperLocation: liveLocation[shopOrder.assignedShipper._id] || {
                    latitude: shopOrder.assignedShipper.location.coordinates[1],
                    longitude:
                      shopOrder.assignedShipper.location.coordinates[0],
                  },
                  customerLocation: {
                    latitude: orderData.deliveryAddress.latitude,
                    longitude: orderData.deliveryAddress.longitude,
                  },
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackOrderPage;
