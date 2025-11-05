
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { useSelector } from "react-redux";

function UserOrderCard({ data }) {

  console.log("data shop user", data);
  const { total, userData } = useSelector((state) => state.user);
  const { newLocation, address } = useSelector((state) => state.map);

  const navigate = useNavigate();

  const [selectedRate, setSelectedRate] = useState({}); //itemId:rating 

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ✅ When "Pay Now" is clicked
  const handlePayNow = async () => {
    // 1️⃣ Gather all items from all shopOrders
    const allItems = data.shopOrders.flatMap((shopOrder) =>
      shopOrder.shopItems.map((item) => ({
        id: item.item?._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.item?.image,
        type: item.item?.type,
        shop: shopOrder.shop,
      }))
    );

    // setCartItems(allItems);
    console.log("Collected cart items:", allItems);

    try {
      const res = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          id: data._id,
          cartItems: allItems,
          paymentMethod: "online",
          deliveryAddress: {
            text: data.deliveryAddress.text,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          },
          totalAmount: data.totalAmount,
        },
        { withCredentials: true }
      );

        const orderId = res.data.orderId;
        const payosOrder = res.data.payosOrder;
        openPayosWindow(orderId, payosOrder);

      // console.log("Place Order: ", res.data);
    } catch (error) {
      console.error(error);
    }
  };

    const openPayosWindow = (orderId, payosOrder) => {

    window.location.href = payosOrder.checkoutUrl;

  };

  const handleRating = async (itemId, rating) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/item/rating`,
        {
          itemId,
          rating,
        },
        { withCredentials: true }
      )
      setSelectedRate(pre => ({...pre, [itemId]: rating}));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">
            Order #{data._id.slice(-6)}
          </span>
          <span className="text-sm text-gray-600">
            {formatDate(data.createdAt)}
          </span>
        </div>
        <div className="space-x-2 flex items-center">
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {data.paymentMethod?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* --- Keep your existing shop orders layout exactly --- */}
      {data.shopOrders.map((shop, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md font-bold">{shop.shop.name}</h2>
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
                  Qty: {items.quantity} x {items.price} vnd
                </p>
                {shop.status === "delivered" && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button className={`${selectedRate[items.item?._id] >= star ? "text-yellow-500" : "text-gray-300"}`} key={star} onClick={() => handleRating(items.item._id, star)}>
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              Subtotal: {shop.subtotal} vnd
            </span>
            {data.paymentMethod === "cod" ? (
              <p className="text-sm text-gray-500 font-medium">
                Cash on Delivery
              </p>
            ) : (
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  data.payment
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {data.payment ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* --- Your original footer --- */}
      {data.paymentMethod === "online" && data.payment === false ? (
        <div className="flex justify-between items-center mt-4 pt-4">
          <span className="text-lg font-bold">Total: {data.totalAmount} vnd</span>
          <button
            className="bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24] transition"
            onClick={handlePayNow}
          >
            Pay Now
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-4 pt-4">
          <span className="text-lg font-bold">Total: {data.totalAmount} vnd</span>
          <button
            className="bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24] transition"
            onClick={() => navigate(`/track-order/${data._id}`)}
          >
            Track Order
          </button>
        </div>
      )}
    </div>
  );
}

export default UserOrderCard;
