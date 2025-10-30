import React, { useEffect } from 'react'
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
export const serverUrl = "http://localhost:8000"

function App() {
  const {userData} = useSelector(state => state.user)
  const dispatch = useDispatch();
  useGetCurrentUser();
  useUpdateLocation();
  useGetLocation();
  useGetShop();
  useGetShopByCity();
  useGetItemByLocation();
  useGetMyOrders();

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
  
  return (
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
      <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to={"/login"} />} />
      <Route path="/payment-success" element={userData ? <PaymentSuccess /> : <Navigate to={"/login"} />} />
      <Route path="/payment-cancel" element={userData ? <PaymentCancel /> : <Navigate to={"/login"} />} />
      <Route path="/not-found" element={userData ? <NotFound /> : <Navigate to={"/login"} />} />
    </Routes>
  )
}

export default App
