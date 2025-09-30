import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, total } = useSelector((state) => state.user);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleNavigateCheckOut = () => {
    navigate("/check-out");
  };

  // const subtotal = cartItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  return (
    <div className="h-screen bg-[#FFF9F6]">
      <div className="py-12">
        <div className="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg md:max-w-5xl">
          <div className="md:flex">
            <div className="w-full p-4 px-5 py-5">
              <div className="md:grid md:grid-cols-1 gap-2">
                {/* Cart Items */}
                <div className="col-span-2 p-5">
                  <h1 className="text-xl font-medium">Shopping Cart</h1>

                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <CartItemCard key={item.id} item={item} />
                    ))
                  ) : (
                    <p className="mt-6 text-gray-500">Your cart is empty.</p>
                  )}

                  {/* Continue + Subtotal */}
                  <div className="flex justify-between items-center mt-6 pt-6 border-t">
                    <div
                      className="flex cursor-pointer"
                      onClick={handleNavigateBack}
                    >
                      <IoMdArrowBack size={25} className="text-sm mr-2" />
                      <span className="text-md font-medium text-[#F59E0B]">
                        Continue Shopping
                      </span>
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="text-sm font-medium text-gray-400 mr-1">
                        Subtotal:
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        ${total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Details bg-gray-800 */}
                <div className="p-5 rounded overflow-visible">
                  {/* <span className="text-xl font-medium text-gray-100 block pb-3">
                    Card Details
                  </span>

                  <div className="flex flex-col pt-3">
                    <label className="text-xs text-gray-400">Name on Card</label>
                    <input
                      type="text"
                      className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm border-b border-gray-600 py-4"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="flex flex-col pt-3">
                    <label className="text-xs text-gray-400">Card Number</label>
                    <input
                      type="text"
                      className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm border-b border-gray-600 py-4"
                      placeholder="**** **** **** ****"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 mb-3">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400">
                        Expiration Date
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm border-b border-gray-600 py-4"
                          placeholder="mm"
                        />
                        <input
                          type="text"
                          className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm border-b border-gray-600 py-4"
                          placeholder="yyyy"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400">CVV</label>
                      <input
                        type="text"
                        className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm border-b border-gray-600 py-4"
                        placeholder="XXX"
                      />
                    </div>
                  </div> */}

                  {total > 0 && (
                    <button className="h-12 w-full bg-[#F59E0B] cursor-pointer rounded focus:outline-none text-white hover:bg-[#FBBF24]" onClick={handleNavigateCheckOut}>
                      Process to Check Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
