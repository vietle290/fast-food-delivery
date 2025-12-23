import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { MdOutlineStarOutline, MdOutlineStarPurple500 } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice/userSlice";

function FoodDetail() {
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const handleDecrement = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const nutritionList = [
    { label: "Calories", value: item?.nutrition?.calories },
    { label: "Protein", value: item?.nutrition?.protein },
    { label: "Carbs", value: item?.nutrition?.carbs },
    { label: "Fat", value: item?.nutrition?.fat },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <MdOutlineStarPurple500 key={i} className="text-yellow-500" />
        ) : (
          <MdOutlineStarOutline key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  useEffect(() => {
    if (!itemId) return;
    const getItemById = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/item/get-item-by-id/${itemId}`,
          { withCredentials: true }
        );
        setItem(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getItemById();
  }, [itemId]);
  console.log(item);
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col items-center">
          <img
            src={item.image}
            alt="Burrito Bowl"
            className="w-full max-w-md object-contain"
          />

          {/* <div className="flex gap-4 mt-6">
            {["/food-1.png", "/food-2.png", "/food-3.png"].map((img, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl border ${
                  i === 0 ? "border-orange-500" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt="thumb"
                  className="w-20 h-20 object-contain"
                />
              </div>
            ))}
          </div> */}
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-gray-400">
              by <span className="text-blue-400">{item.shop?.name}</span>
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {renderStars(item.rating?.average || 0)}
            </div>
            <span className="text-gray-400">
              | {item.rating?.count || 0} Reviews
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">{item?.description}</p>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            <span className="px-4 py-1 border border-gray-600 rounded-full text-sm">
              {item.type}
            </span>
          </div>

          {/* Size */}
          {/* <div className="space-y-2">
            <p className="font-semibold">Size:</p>
            <div className="flex gap-3">
              {["S", "M", "L"].map((size, i) => (
                <button
                  key={size}
                  className={`w-10 h-10 rounded-full ${
                    i === 0
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div> */}

          {/* Quantity + Buy */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-900 rounded-full px-3 py-2 gap-4">
              <button onClick={handleDecrement} className="text-xl">
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={handleIncrement} className="text-xl">
                <FaPlus />
              </button>
            </div>

            <button
              onClick={() => {
                if (quantity === 0) return;
                dispatch(
                  addToCart({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: quantity,
                    image: item.image,
                    type: item.type,
                    shop: item.shop,
                  })
                );
                navigate("/cart-page");
              }}
              className="bg-[#F59E0B] hover:bg-[#FBBF24] transition px-8 py-3 rounded-full font-semibold"
            >
              Buy Now
            </button>

            {/* <button className="text-gray-400 text-2xl">♡</button> */}
          </div>

          {/* Nutrition */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Nutrition Facts{" "}
              <span className="text-gray-400">(per serving)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-900 rounded-xl p-4">
              {nutritionList.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-lg font-bold">{item.value}</p>
                  <p className="text-gray-400 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Viewers */}
          {/* <p className="text-orange-500 text-sm mt-4">
            👁 152 People are viewing this right now
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;
