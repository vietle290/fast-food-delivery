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

  return <div>Đang xác minh thanh toán, vui lòng chờ...</div>;
}
