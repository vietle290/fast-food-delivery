import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/slice/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/order/get-user-orders`,
          {
            withCredentials: true,
          }
        );
        dispatch(setMyOrders(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetMyOrders;
