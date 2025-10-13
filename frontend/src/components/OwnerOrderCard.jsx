import React from "react";
import { useDispatch } from "react-redux";
import { FaPhone } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { updateOrderStatuss } from "../redux/slice/userSlice";
import { useState } from "react";

function OwnerOrderCard({ data }) {
  const dispatch = useDispatch();
  const [avaibleShippers, setAvaibleShippers] = useState([]);
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status: status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatuss({ orderId, shopId, status }));
      setAvaibleShippers(res.data.avaibleShippers);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4 font-sans">
      {/* Order Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">
            {data.user.fullName} - Order #{data._id.slice(-6)}
          </span>
          {/* <span className="text-sm text-gray-600">
            {formatDate(data.createdAt)}
          </span> */}
          <span className="text-sm text-gray-600">{data.user.email}</span>
          <p className="text-sm flex items-center mt-1 gap-2">
            <FaPhone />
            <span>{data.user.mobile}</span>
          </p>
          <span>{data?.deliveryAddress?.text}</span>
          {data.paymentMethod == "online" ? (
            <p>Payment: {data.payment ? <span className="font-medium text-green-500">Paid</span> : <span className="font-medium text-red-500">Unpaid</span>}</p>
          ) : <span>PaymentMethod: Cash on delivery</span> }
        </div>
        <div className="space-x-2 flex items-center">
          {/* <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {data.paymentMethod?.toUpperCase()}
          </span> */}
          {/* <span className="text-sm text-gray-600">
            {formatDate(data.createdAt)}
          </span> */}
          {/* css if else pending blue, preparing orange, out for delivery green, delivered green*/}
          {/* <span
            className={`text-sm font-medium ${
              data.shopOrders?.[0]?.status === "pending"
                ? "text-blue-600"
                : data.shopOrders?.[0]?.status === "preparing"
                ? "text-orange-600"
                : data.shopOrders?.[0]?.status === "delivered"
                ? "text-green-600"
                : "text-green-600"
            } bg-orange-100 px-2 py-1 rounded`}
          >
            {data.shopOrders?.[0]?.status}
          </span> */}
        </div>
      </div>

      {data.shopOrders.map((shop, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
          <div className="flex justify-end items-center mb-3">
            <span
              className={`text-sm font-medium ${
                shop.status === "pending"
                  ? "text-blue-600 bg-blue-50"
                  : shop.status === "preparing"
                  ? "text-orange-600 bg-orange-50"
                  : shop.status === "delivered"
                  ? "text-green-600 bg-green-50"
                  : "text-green-600 bg-green-50"
              } px-2 py-1 rounded`}
            >
              {shop.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3">
            {shop.shopItems.map((items, itemIndex) => (
              <div
                key={itemIndex}
                className="bg-gray-50 rounded-lg p-2 text-center shadow-sm"
              >
                <img
                  src={items.item?.image}
                  alt={items.name}
                  className="w-full h-45 object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium">{items.name}</p>
                <p className="text-xs text-gray-600">
                  Qty: {items.quantity} x ${items.price}
                </p>
              </div>
            ))}
          </div>
          {/* <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              Subtotal: ${shop.subtotal}
            </span>
            <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">{shop.status}</span>
          </div> */}
        </div>
      ))}

      {data.shopOrders[0].status == "out-for-delivery" && (
        <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
          {data.shopOrders?.[0]?.assignedShipper ? (
            <span className="font-semibold">Assigned Shippers:</span>
          ) : (
            <span className="font-semibold">Available Shippers:</span>
          )}

          {avaibleShippers.length > 0 ? (
            avaibleShippers.map((shipper, index) => (
              <p key={index} className="mt-1">
                {shipper.fullName} - {shipper.mobile}
              </p>
            ))
          ) : data.shopOrders?.[0]?.assignedShipper ? (
            <p className="mt-1">
              {data.shopOrders?.[0]?.assignedShipper.fullName} -{" "}
              {data.shopOrders?.[0]?.assignedShipper.mobile}
            </p>
          ) : (
            <p className="mt-1">No available shippers at the moment.</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4">
        <span className="text-lg font-bold">Total: ${data.totalAmount}</span>
        <div>
          <select
            value={data.shopOrders[0].status}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ountline-none focus:ring-2 focus:ring-[#F59E0B] text-[#F59E0B]"
            onChange={(e) =>
              handleUpdateStatus(
                data._id,
                data.shopOrders[0].shop._id,
                e.target.value
              )
            }
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default OwnerOrderCard;
