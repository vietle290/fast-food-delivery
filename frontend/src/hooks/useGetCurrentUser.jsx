import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  clearUserData,
  setCurrentAddress,
  setCurrentState,
  setItemInCity,
  setLoading,
  setLocation,
  setMyOrders,
  setShopInCity,
  setUserData,
} from "../redux/slice/userSlice";
import { setNewLocation } from "../redux/slice/mapSlice";
import { useNavigate } from "react-router-dom";

function useGetCurrentUser() {
  const {loading, userData} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (userData) return;
    dispatch(setLoading(true));
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
          // dispatch(setNewLocation(null));
          navigate("/login");
        } else {
          console.error("Error fetching current user:", error);
        }
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCurrentUser();
  }, [dispatch, userData]);
  return loading;
}

export default useGetCurrentUser;
