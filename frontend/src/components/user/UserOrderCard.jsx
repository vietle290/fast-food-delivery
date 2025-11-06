
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { useSelector } from "react-redux";
import CustomMyOrder from "../CustomMyOrder";

function UserOrderCard({ data }) {

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
    <>
      <CustomMyOrder data={data} selectedRate={selectedRate} handleRating={handleRating} formatDate={formatDate} handlePayNow={handlePayNow} navigate={navigate}/>
    </>
  );
}

export default UserOrderCard;
