import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { MdMyLocation } from "react-icons/md";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setNewLocation } from "../redux/slice/mapSlice";
import axios from "axios";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";
import { serverUrl } from "../App";
import { addOrder } from "../redux/slice/userSlice";

function RecenterAutomatically({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.latitude, center.longitude], map.getZoom(), {
      animate: true,
    });
  }, [center, map]);
  return null;
}

function CheckOut() {
  const { cartItems, total, userData } = useSelector((state) => state.user);
  console.log("cartItems: ", cartItems);
  const { newLocation, address } = useSelector((state) => state.map);
  const [addressInput, setAddressInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const fee = total > 500 ? 0 : 50;
  const totalAmount = total + fee;
  const handleNavigateBack = () => {
    navigate(-1);
  };
  const onDragEnd = (e) => {
    // console.log(e.target._latlng);
    dispatch(
      setNewLocation({
        latitude: e.target._latlng.lat,
        longitude: e.target._latlng.lng,
      })
    );
    getAddressByLatLng(e.target._latlng.lat, e.target._latlng.lng);
  };

  const getAddressByLatLng = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      const address =
        result?.data?.results[0].county +
        ", " +
        result?.data?.results[0].formatted;
      dispatch(setAddress(address));
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(
      setNewLocation({
        latitude: latitude,
        longitude: longitude,
      })
    );
    getAddressByLatLng(latitude, longitude);
  };

  const getAddressBySearch = async () => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setNewLocation({ latitude: lat, longitude: lon }));
      getAddressByLatLng(lat, lon);
    } catch (error) {
      console.error(error);
    }
  };

  const getAddressSuggestions = async (query) => {
    try {
      if (!query) {
        setSearchResults([]);
        return;
      }
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:vn&apiKey=${apiKey}`
      );
      setSearchResults(result.data.features || []);
      console.log("search results:", result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSuggestion = (place) => {
    const { lat, lon, formatted } = place.properties;
    setAddressInput(formatted);
    setSearchResults([]);
    dispatch(setNewLocation({ latitude: lat, longitude: lon }));
    dispatch(setAddress(formatted));
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          cartItems,
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          },
          totalAmount,
        },
        { withCredentials: true }
      );
      if (paymentMethod == "cod") {
        dispatch(addOrder(res.data));
        if (res.status === 201) {
          navigate("/order-placed");
        }
      } else {
        const orderId = res.data.orderId;
        const payosOrder = res.data.payosOrder;
        openPayosWindow(orderId, payosOrder);
      }

      // console.log("Place Order: ", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openPayosWindow = (orderId, payosOrder) => {

    window.location.href = payosOrder.checkoutUrl;

  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F6] p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={handleNavigateBack}
      >
        <IoMdArrowBack
          size={30}
          className="text-[#F59E0B] hover:text-[#FBBF24]"
        />
      </div>
      <div className="w-full max-w-[900px] rounded-2xl bg-white shadow-xl space-y-6 p-6">
        <h1 className="text-2xl font-bold text-gray-600">CheckOut</h1>
        <section>
          <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
            <IoLocationSharp size={20} className="text-[#F59E0B]" /> Delivery
            Location
          </h2>
          <div className="flex gap-2 mb-3 relative">
            <input
              type="text"
              className="flex-1 border border-gray-400 px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              placeholder="Enter your address"
              value={addressInput || ""}
              onChange={(e) => {
                setAddressInput(e.target.value);
                getAddressSuggestions(e.target.value);
              }}
            />
            {searchResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-10 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto z-[9999]">
                {searchResults.map((place, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSelectSuggestion(place)}
                  >
                    {place.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={getAddressBySearch}
              className="bg-[#F59E0B] rounded-lg px-2 py-2 text-white flex items-center justify-center hover:bg-[#FBBF24] cursor-pointer"
            >
              <IoIosSearch size={20} />
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-blue-500 rounded-lg px-2 py-2 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer"
            >
              <MdMyLocation size={20} />
            </button>
          </div>
          {newLocation?.latitude && newLocation?.longitude ? (
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="w-full h-full"
                center={[newLocation?.latitude, newLocation?.longitude]}
                zoom={13}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterAutomatically center={newLocation} />
                <Marker
                  position={[newLocation?.latitude, newLocation?.longitude]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
          ) : <></>}
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-600">
            Payment Method
          </h2>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={`flex items-center gap-3 border rounded-xl p-4 text-left transition ${paymentMethod === "cod" ? "border-[#F59E0B] shadow bg-orange-50" : "border-gray-300 hover:border-gray-400"}`} onClick={() => setPaymentMethod("cod")}></div>
            <div className={`flex items-center gap-3 border rounded-xl p-4 text-left transition ${paymentMethod === "online" ? "border-[#F59E0B] shadow bg-orange-50" : "border-gray-300 hover:border-gray-400"}`} onClick={() => setPaymentMethod("online")}></div>
          </div> */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className={`flex items-center gap-3 border rounded-xl p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#F59E0B] shadow bg-orange-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <FaMoneyBillWaveAlt
                size={40}
                className="text-2xl text-green-500 rounded-full bg-green-200 px-2 py-1"
              />
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay when you receive the order
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 border rounded-xl p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#F59E0B] shadow bg-orange-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <FaCreditCard
                size={40}
                className="text-2xl text-blue-500 rounded-full bg-blue-200 px-2 py-1"
              />
              <div>
                <p className="font-semibold">Online Payment</p>
                <p className="text-sm text-gray-500">
                  Pay securely with card or other methods
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-600">Order Summary</h2>
          <div className="border rounded-lg bg-gray-100 p-4">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <p className="font-semibold">
                        {item.name} x {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">${item.price}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between">
              <p className="font-semibold">Subtotal</p>
              <p className="font-semibold">${total}</p>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between">
              <p className="font-semibold">Delivery Fee</p>
              <p className="font-semibold text-gray-500">
                ${fee === 0 ? "Free" : fee}
              </p>
            </div>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between">
            <p className="font-semibold text-[#F59E0B]">Total</p>
            <p className="font-semibold">${totalAmount}</p>
          </div>
        </section>
        <button
          className="bg-[#F59E0B] text-white py-2 px-4 rounded-md hover:bg-[#FBBF24] transition-colors duration-300 w-full"
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
