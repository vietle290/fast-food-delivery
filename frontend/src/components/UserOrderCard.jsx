import React from "react";

function UserOrderCard(order) {
  const data = order.data;
  const shopOrders = data.shopOrders;
  console.log(order);
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
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4 font-sans">
      {/* Order Header */}
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
          {/* css if else pending blue, preparing orange, out for delivery green, delivered green*/}
          <span
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
          </span>
        </div>
      </div>

      {shopOrders.map((shop, index) => (
        <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
          <h2 className="text-md font-bold mb-3">{shop.shop.name}</h2>
          <div className="grid grid-cols-2 gap-4 mb-3">
            {shop.shopItems.map((items, itemIndex) => (
              <div
                key={itemIndex}
                className="bg-gray-50 rounded-lg p-2 text-center shadow-sm"
              >
                <img
                  src={items.item.image}
                  alt={items.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium">{items.name}</p>
                <p className="text-xs text-gray-600">
                  Qty: {items.quantity} x ${items.price}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              Subtotal: ${shop.subtotal}
            </span>
            {/* <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">{shop.status}</span> */}
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4 pt-4">
        <span className="text-lg font-bold">Total: ${data.totalAmount}</span>
        <button className="bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
