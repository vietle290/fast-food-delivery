import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

function FoodFilterPopup({ setOpenFilterModal, onClose, filterItemsByNameShopType }) {
  const { location } = useSelector((state) => state.user);
  const [shopData, setShopData] = useState([]);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [name, setName] = useState("");
  const [shop, setShop] = useState("");
  const shopId = shopData.find((s) => s.name === shop)?._id || "";
  const [type, setType] = useState("");
  const handleSearchShop = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/shop/search-shop-by-name?name=${shop}&city=${location}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setShopData(res.data);
      console.log("Shop search data:", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!shop.trim()) {
      setShopData([]);
      return;
    }

    const timeout = setTimeout(() => {
      handleSearchShop();
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [shop]);
  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      {/* Popup */}
      <div
        className="m-2 w-full max-w-screen-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-stone-700 text-xl font-bold">Apply filters</h2>
        <p className="mt-1 text-sm">Use filters to further refine search</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <div className="flex flex-col">
            <label className="text-stone-600 text-sm font-medium">Food</label>
            <input
              type="text"
              placeholder="Food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 rounded-md border px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-stone-600 text-sm font-medium">Shop</label>

            <input
              type="text"
              placeholder="Shop name"
              value={shop}
              onChange={(e) => {
                setShop(e.target.value);
                setShowShopDropdown(true);
              }}
              onFocus={() => shopData.length && setShowShopDropdown(true)}
              className="mt-2 rounded-md border px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            {/* Dropdown result */}
            {showShopDropdown && shopData.length > 0 && (
              <div className="absolute top-full mt-1 z-50 w-full max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg">
                {shopData.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setShop(item.name);
                      setShowShopDropdown(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-stone-600 text-sm font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 rounded-md border px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200">
              <option value="">All</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-veg">Non-Vegetarian</option>
              <option value="Others">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {/* <button className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-600 hover:opacity-90">
            Reset
          </button> */}
          <button onClick={() => filterItemsByNameShopType({ name, shopId, type })} className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white hover:opacity-90">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodFilterPopup;
