import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserData,
  setAuthLoading,
  setUserData,
} from "../redux/slice/userSlice";

function useGetCurrentUser() {
  const {authLoading} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // if (userData) return;
    dispatch(setAuthLoading(true));
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/current-user`, {
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
          // navigate("/login");
        } else {
          console.error("Error fetching current user:", error);
        }
      } finally {
        dispatch(setAuthLoading(false));
      }
    };
    fetchCurrentUser();
  }, [dispatch]);
  return authLoading;
}

export default useGetCurrentUser;
