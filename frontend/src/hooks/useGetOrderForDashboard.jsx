// import axios from 'axios';
// import { useEffect } from 'react'
// import { serverUrl } from '../App';
// import { useDispatch, useSelector } from 'react-redux';
// import { setActiveSellingFood, setLoading, setPerDaysWeeklyTotalDeliveredOrders, setPopularDishes, setRevenueOrder, setThreeLatestOrderUpdate, setTotalFoodInShop, setTotalTodayDeliveredOrder } from '../redux/slice/userSlice';

// function useGetOrderForDashboard() {
//     const dispatch = useDispatch();
//     const { userData } = useSelector(state => state.user);
//     const { shopData } = useSelector(state => state.owner)
//     const shopId = shopData?._id;
//     useEffect(() => {
//         if (!userData || userData.role !== 'owner' || !shopId) return;
//         const fetchTodayDeliveredOrders = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/order/get-all-today-delivered-orders`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     withCredentials: true,
//                 });
//                 dispatch(setTotalTodayDeliveredOrder(response.data.length));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };
//         const fetchThreeLatestUpdatedAtOrders = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/order/get-three-latest-updated-at-orders/${shopId}`, {
//                     withCredentials: true,
//                 });
//                 dispatch(setThreeLatestOrderUpdate(response.data));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };
//         const fetchTotalOfSubTotalDeliveredOrdersByShop = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/order/get-total-of-subtotal-delivered-orders-by-shop/${shopId}`, {
//                     withCredentials: true,
//                 });
//                 dispatch(setRevenueOrder(response.data));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };
//         const fetchTotalNumberOfActiveSellingFoodsByShop = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/order/get-total-number-of-active-selling-foods-by-shop/${shopId}`, {
//                     withCredentials: true,
//                 });
//                 dispatch(setActiveSellingFood(response.data.total));
//                 dispatch(setTotalFoodInShop(response.data.totalSellAndUnSell));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };

//         const getFourBestSellFoodByShop = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/item/get-four-largest-total-sell-by-shop/${shopId}`, {
//                     withCredentials: true,
//                 });
//                 dispatch(setPopularDishes(response.data));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };

//         const getPerDaysWeeklyTotalDeliveredOrdersByShop = async () => {
//             // setLoading(true);
//             try {
//                 const response = await axios.get(`${serverUrl}/api/order/get-per-days-weekly-total-delivered-orders-by-shop/${shopId}`, {
//                     withCredentials: true,
//                 });
//                 dispatch(setPerDaysWeeklyTotalDeliveredOrders(response.data));
//                 // setLoading(false);
//             } catch (error) {
//                 // setLoading(false);
//                 console.error(error);
//             }
//         };

//         fetchThreeLatestUpdatedAtOrders();
//         fetchTodayDeliveredOrders();
//         fetchTotalOfSubTotalDeliveredOrdersByShop();
//         fetchTotalNumberOfActiveSellingFoodsByShop();
//         getPerDaysWeeklyTotalDeliveredOrdersByShop();
//         getFourBestSellFoodByShop();

//     }, [dispatch, userData, shopId]);
// }

// export default useGetOrderForDashboard;

import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";

import {
  setActiveSellingFood,
  setLoading,
  setPerDaysWeeklyTotalDeliveredOrders,
  setPopularDishes,
  setRevenueOrder,
  setThreeLatestOrderUpdate,
  setTotalFoodInShop,
  setTotalTodayDeliveredOrder,
} from "../redux/slice/userSlice";
import { setTotalActiveOrders } from "../redux/slice/ownerSlice";

function useGetOrderForDashboard() {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { shopData } = useSelector((state) => state.owner);

  const shopId = shopData?._id;

  useEffect(() => {
    if (!userData || userData.role !== "owner" || !shopId) return;

    const fetchDashboard = async () => {
      try {
        // dispatch(setLoading(true));

        const [
          todayOrdersRes,
          latestOrdersRes,
          revenueRes,
          foodsRes,
          weeklyOrdersRes,
          popularFoodsRes,
          activeOrders,
        ] = await Promise.all([
          axios.get(`${serverUrl}/api/order/get-all-today-delivered-orders`, {
            withCredentials: true,
          }),
          axios.get(
            `${serverUrl}/api/order/get-three-latest-updated-at-orders/${shopId}`,
            { withCredentials: true }
          ),
          axios.get(
            `${serverUrl}/api/order/get-total-of-subtotal-delivered-orders-by-shop/${shopId}`,
            { withCredentials: true }
          ),
          axios.get(
            `${serverUrl}/api/order/get-total-number-of-active-selling-foods-by-shop/${shopId}`,
            { withCredentials: true }
          ),
          axios.get(
            `${serverUrl}/api/order/get-per-days-weekly-total-delivered-orders-by-shop/${shopId}`,
            { withCredentials: true }
          ),
          axios.get(
            `${serverUrl}/api/item/get-four-largest-total-sell-by-shop/${shopId}`,
            { withCredentials: true }
          ),
          axios.get(
            `${serverUrl}/api/order/get-total-active-orders-by-shop/${shopId}`,
            { withCredentials: true }
          ),
        ]);

        dispatch(setTotalTodayDeliveredOrder(todayOrdersRes.data.length));

        dispatch(setThreeLatestOrderUpdate(latestOrdersRes.data));

        dispatch(setRevenueOrder(revenueRes.data));

        dispatch(setActiveSellingFood(foodsRes.data.total));
        dispatch(setTotalFoodInShop(foodsRes.data.totalSellAndUnSell));

        dispatch(
          setPerDaysWeeklyTotalDeliveredOrders(weeklyOrdersRes.data)
        );

        dispatch(setPopularDishes(popularFoodsRes.data));
        dispatch(setTotalActiveOrders(activeOrders.data));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        // dispatch(setLoading(false));
      }
    };

    fetchDashboard();
  }, [dispatch, userData, shopId]);
}

export default useGetOrderForDashboard;