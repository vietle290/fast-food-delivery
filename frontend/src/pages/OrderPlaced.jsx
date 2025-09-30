import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center">
          <FaCheckCircle className="text-green-500 text-6xl animate-bounce mb-4" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and is
          being processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-[#F59E0B] hover:bg-[#FBBF24] text-white px-6 py-2 rounded-md transition"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition"
            onClick={() => navigate("/my-orders")}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPlaced;
