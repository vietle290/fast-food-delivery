import React from "react";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateQuantity, removeCart } from "../redux/slice/userSlice";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";


function CartItemCard({ item }) {
  const dispatch = useDispatch();
  const handleIncrement = (id, quantity) => {
    quantity < 20 && dispatch(updateQuantity({ id: id, quantity: quantity + 1 }));
  }
  const handleDecrement = (id, quantity) => {
    quantity > 1 && dispatch(updateQuantity({ id: id, quantity: quantity - 1 }));
  }
  const handleRemove = (id) => {
    dispatch(removeCart(id));
  }
  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t first:border-t-0 first:mt-0 first:pt-0">
      {/* Left side - image + info */}
      <div className="flex items-center">
        <img
          src={item.image}
          alt={item.name}
          width="60"
        />
        <div className="flex flex-col ml-3">
          <span className="md:text-md font-medium">{item.name}</span>
          <span className="text-xs font-light text-gray-400">${item.price} x {item.quantity}</span>
        </div>
      </div>

      {/* Right side - qty + price + remove */}
      <div className="flex justify-center items-center">
        <div className="MD:pr-8">
          <button
            className="font-semibold px-2 cursor-pointer hover:text-red-500"
            onClick={() => handleDecrement(item.id, item.quantity)}
          >
            <FaMinus />
          </button>
          <input
            type="text"
            readOnly
            className="focus:outline-none bg-gray-100 border h-6 w-8 rounded text-sm lg:px-2 lg:mx-2 text-center"
            value={item.quantity}
          />
          <button
            className="font-semibold px-2 cursor-pointer hover:text-green-500"
            onClick={() => handleIncrement(item.id, item.quantity)}
          >
            <FaPlus />
          </button>
        </div>

        <div className="md:pr-8">
          <span className="text-xs font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <div>
          <button
            className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center cursor-pointer"
            onClick={() => handleRemove(item.id)}
          >
            <MdOutlineRemoveShoppingCart size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;
