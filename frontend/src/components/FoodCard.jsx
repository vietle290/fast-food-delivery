import { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slice/userSlice";

function FoodCard({ item }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const handleDecrement = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  // const handleAddToCart = (item) => {
  //   console.log("adddddddddddddddddddddddd")
  //   dispatch(addToCart({
  //     id: item._id,
  //     name: item.name,
  //     price: item.price,
  //     quantity: quantity,
  //     image: item.image,
  //     type: item.type,
  //     shop: item.shop
  //   }))
  // };
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
  return (
    <div className="w-[180px] md:w-[270px] rounded-xl bg-white shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="relative w-full md:h-[180px] h-[120px] flex justify-center items-center bg-white">
        <div className="absolute top-2 right-2 bg-white p-2 rounded-full">
          {item.type === "Veg" ? (
            <FaLeaf className="text-green-500" />
          ) : (
            item.type === "Non-veg" && <IoFastFood className="text-red-500" />
          )}
        </div>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
        <p className="text-gray-600">Type: {item.type}</p>
        <div className="text-gray-600 flex items-center mt-1">
          Rating: {renderStars(item.rating?.average || 0)}
          <span>{item.rating?.count || 0}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between items-center mt-auto border-t md:flex-row sm:gap-3">
        <div className="text-gray-900 text-lg font-bold">{item.price} đ</div>
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button className="px-2 py-1 bg-white text-gray-800 hover:bg-gray-100 transition">
            <FaMinus onClick={handleDecrement} />
          </button>
          <span className="px-2 py-1 text-gray-800">{quantity}</span>
          <button className="px-2 py-1 bg-white text-gray-800 hover:bg-gray-100 trasition">
            <FaPlus onClick={handleIncrement} />
          </button>
          <button
            className="px-3 py-2 bg-[#F59E0B] text-gray-800 hover:bg-[#FBBF24] transition cursor-pointer"
            onClick={() => {
              if (quantity > 0) {
                dispatch(
                  addToCart({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: quantity,
                    image: item.image,
                    type: item.type,
                    shop: {
                      _id: item.shop._id,
                      name: item.shop.name,
                    },
                  })
                );
              }
            }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
