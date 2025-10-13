// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import { addOrder } from "../redux/slice/userSlice";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const payos_payment_id = params.get("paymentLinkId") || params.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/order/verify-payment`,
          { orderId, payos_payment_id },
          { withCredentials: true }
        );
        dispatch(addOrder(res.data));
        navigate("/order-placed");
      } catch (err) {
        console.error("Payment verification failed:", err);
      }
    };

    if (orderId && payos_payment_id) {
      verifyPayment();
    }
  }, [orderId, payos_payment_id]);

  return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-sm w-full">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verifying Payment
        </h2>
        <p className="text-gray-600">
          Please wait a moment while we verify your transaction...
        </p>
      </div>

      <p className="text-gray-400 text-sm mt-6">
        Do not leave this page until the verification is complete.
      </p>
    </div>
  );
}
