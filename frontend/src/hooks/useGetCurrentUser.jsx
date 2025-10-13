import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import {
  clearCart,
  clearUserData,
  setCurrentAddress,
  setCurrentState,
  setItemInCity,
  setLocation,
  setMyOrders,
  setShopInCity,
  setUserData,
} from "../redux/slice/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/current-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        dispatch(setUserData(response.data));
      } catch (error) {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          console.warn("Token expired or unauthorized. Logging out...");
          sessionStorage.clear(); // clear all sessionStorage
          // Clear all Redux state
          dispatch(clearUserData());
          dispatch(clearCart());
          dispatch(setMyOrders([]));
          dispatch(setLocation(null));
          dispatch(setCurrentState(null));
          dispatch(setCurrentAddress(null));
          dispatch(setShopInCity(null));
          dispatch(setItemInCity(null));
        } else {
          console.error("Error fetching current user:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
