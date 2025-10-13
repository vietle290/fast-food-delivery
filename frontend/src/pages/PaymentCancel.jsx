import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slice/userSlice";

function PaymentCancel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigateMyOrders = () => {
    dispatch(clearCart());
    navigate("/my-orders")
  }

  const handleNavigateHome = () => {
    dispatch(clearCart());
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-red-500 mx-auto mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No money has been deducted from your
          account.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleNavigateHome}
            className="px-5 py-2 bg-[#F59E0B] text-gray-700 rounded-sm hover:bg-gray-300 transition"
          >
            Go to Home
          </button>
          <button
            onClick={handleNavigateMyOrders}
            className="px-5 py-2 bg-gray-300 text-black rounded-sm hover:bg-red-600 transition"
          >
            My Orders
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-8">
        If this was a mistake, you can retry your payment anytime.
      </p>
    </div>
  );
}

export default PaymentCancel;
