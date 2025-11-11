import React, { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetLocation from './hooks/useGetLocation'
import useGetShop from './hooks/useGetShop'
import CreateUpdateShop from './pages/CreateUpdateShop'
import AddItem from './pages/AddItem'
import UpdateItem from './pages/UpdateItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemByLocation from './hooks/useGetItemByLocation'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import { io } from 'socket.io-client'
import { setSocket } from './redux/slice/userSlice'
import NotFound from './pages/NotFound'
import useGetCategory from './hooks/useGetcategory'
import useGetCategoryByShop from './hooks/usegetCategoryByShop'

// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const Home = lazy(() => import("./pages/Home"));
// const CreateUpdateShop = lazy(() => import("./pages/CreateUpdateShop"));
// const AddItem = lazy(() => import("./pages/AddItem"));
// const UpdateItem = lazy(() => import("./pages/UpdateItem"));
// const CartPage = lazy(() => import("./pages/CartPage"));
// const CheckOut = lazy(() => import("./pages/CheckOut"));
// const OrderPlaced = lazy(() => import("./pages/OrderPlaced"));
// const MyOrders = lazy(() => import("./pages/MyOrders"));
// const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
// const Shop = lazy(() => import("./pages/Shop"));
// const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
// const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
// const NotFound = lazy(() => import("./pages/NotFound"));

export const serverUrl = "https://fast-food-backend-4p7f.onrender.com"

function App() {
  const {userData, loading} = useSelector(state => state.user)
  const dispatch = useDispatch();
  useGetCurrentUser();
  useGetLocation();
  useUpdateLocation();
  useGetShop();
  useGetShopByCity();
  useGetItemByLocation();
  useGetMyOrders();
  useGetCategory();
  useGetCategoryByShop();

  useEffect(() => {
    const socketInstance = io(serverUrl, {withCredentials: true});
    dispatch(setSocket(socketInstance));
    socketInstance.on("connect", () => {
      if(userData) socketInstance.emit("identity", {userId: userData._id});
    })
    return () => {
      socketInstance.disconnect();
    }
  }, [userData?._id])

  console.log("App userData:", userData);

  //   if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-gray-600">
  //       Loading...
  //     </div>
  //   );
  // }
  
  return (
    // <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
    <Routes>
      <Route path="/" element={userData ? <Home /> : <Navigate to={"/login"} />} />
      <Route path="/home" element={userData ? <Home /> : <Navigate to={"/login"} />} />
      <Route path="/login" element={!userData ? <Login /> : <Navigate to={"/"} />} />
      <Route path="/register" element={!userData ? <Register /> : <Navigate to={"/"} />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path="/create-update-shop" element={userData ? <CreateUpdateShop /> : <Navigate to={"/login"} />} />
      <Route path="/add-item" element={userData ? <AddItem /> : <Navigate to={"/login"} />} />
      <Route path="/update-item/:itemId" element={userData ? <UpdateItem /> : <Navigate to={"/login"} />} />
      <Route path="/cart-page" element={userData ? <CartPage /> : <Navigate to={"/login"} />} />
      <Route path="/check-out" element={userData ? <CheckOut /> : <Navigate to={"/login"} />} />
      <Route path="/order-placed" element={userData ? <OrderPlaced /> : <Navigate to={"/login"} />} />
      <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to={"/login"} />} />
      <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to={"/login"} />} />
      <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to={"/login"} />} />
      <Route path="/payment-success" element={userData ? <PaymentSuccess /> : <Navigate to={"/login"} />} />
      <Route path="/payment-cancel" element={userData ? <PaymentCancel /> : <Navigate to={"/login"} />} />
      <Route path="/not-found" element={userData ? <NotFound /> : <Navigate to={"/login"} />} />
    </Routes>
    // </Suspense>
  )
}

export default App
