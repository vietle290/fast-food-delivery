import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemInCity, setItemLoading } from "../redux/slice/userSlice";

function useGetItemByLocation() {
  const dispatch = useDispatch();
  const { location, userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData) return;
    const fetchItemByLocation = async () => {
      dispatch(setItemLoading(true));
      try {
        if (!location) {
          let res = await axios.get(`${serverUrl}/api/item/get-all-items`, {
            withCredentials: true,
          });
          dispatch(setItemInCity(res.data));
          dispatch(setItemLoading(false));
          return;
        }
        const response = await axios.get(
          `${serverUrl}/api/item/get-item-by-location/${location}?page=1&limit=8`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemInCity(response.data.items));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setItemLoading(false));
      }
    };
    fetchItemByLocation();
  }, [location, dispatch, userData]);
}

export default useGetItemByLocation;
