import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/slice/userSlice";

function useGetShipperOrderById() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData) return;
    if (userData.role !== "shipper") return;
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/api/order/get-shipper-order-by-id/${userData._id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Shipper orders fetched:", response.data);
        dispatch(setMyOrders(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetShipperOrderById;
