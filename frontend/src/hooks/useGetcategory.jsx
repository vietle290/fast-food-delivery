import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryies } from "../redux/slice/userSlice";

function useGetCategory() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData) return;
    if (userData.role !== "owner") {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(
            `${serverUrl}/api/category/get-all-category`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          dispatch(setCategoryies(response.data));
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategory();
    }
  }, [dispatch, userData]);
}

export default useGetCategory;
