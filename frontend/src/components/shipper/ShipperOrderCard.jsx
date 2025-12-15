import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useEffect } from "react";

function ShipperOrderCard() {
  const { myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const filteredOrders = useMemo(() => {
    if (!myOrders || myOrders.length === 0) return [];

    // SHOW ALL
    if (filterType === "all") return myOrders;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return myOrders.filter((order) => {
      if (!order.deliveredAt) return false;

      const deliveredDate = new Date(order.deliveredAt);
      deliveredDate.setHours(0, 0, 0, 0);

      // TODAY
      if (filterType === "today") {
        return deliveredDate.getTime() === today.getTime();
      }

      // RANGE
      if (filterType === "range" && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        return deliveredDate >= from && deliveredDate <= to;
      }

      return true;
    });
  }, [myOrders, filterType, fromDate, toDate]);

  useEffect(() => {
    if (filterType === "all") {
      setFromDate("");
      setToDate("");
    }
  }, [filterType]);

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#FFF9F6] px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-2 sm:p-4 md:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="cursor-pointer" onClick={handleNavigateBack}>
            <IoMdArrowBack
              size={24}
              className="text-[#F59E0B] hover:text-[#FBBF24] sm:text-2xl"
            />
          </div>
          <h1 className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-800">
            My Orders
          </h1>
        </div>
        <div className="flex justify-center">
          {/* {!myOrders && ( */}
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md mt-6 p-6">
            <div className="flex justify-between">
              <h3 className="text-base font-semibold text-gray-800">
                Finished Orders
              </h3>
              <div>
                <button
                  onClick={() => setShowFilter(true)}
                  className="text-sm px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Filter
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No Available Orders</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {filteredOrders.map((order, index) => (
                  <li
                    key={index}
                    className="p-4 rounded-lg shadow-sm border bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="w-full">
                        <h4 className="font-semibold text-sm text-gray-800">
                          {order.shop?.name}
                        </h4>
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm text-gray-600 mt-1">
                            Delivery At:{" "}
                            {order.deliveredAt
                              ? new Date(order.deliveredAt).toLocaleString(
                                  "vi-VN",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "N/A"}
                          </p>
                          <div className="text-sm text-green-600">
                            {order.status}
                          </div>
                        </div>

                        {/* Items */}
                        <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                          {order?.shopItems.map((item, idx) => (
                            <li key={idx}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>

                        {/* Subtotal */}
                        <p className="text-sm font-semibold text-gray-800 mt-2">
                          total: ${order.subtotal}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showFilter && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-sm rounded-xl p-5 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Filter Orders</h3>

                {/* Filter Type */}
                <div className="flex flex-col gap-3 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={filterType === "all"}
                      onChange={() => setFilterType("all")}
                    />
                    All
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={filterType === "today"}
                      onChange={() => setFilterType("today")}
                    />
                    Today
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={filterType === "range"}
                      onChange={() => setFilterType("range")}
                    />
                    Date Range
                  </label>
                </div>

                {/* Date range */}
                {filterType === "range" && (
                  <div className="flex flex-col gap-3 mb-4">
                    <div>
                      <label className="text-sm text-gray-600">From</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">To</label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="px-4 py-2 text-sm rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-[#F59E0B] text-white hover:bg-[#FBBF24]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default ShipperOrderCard;
