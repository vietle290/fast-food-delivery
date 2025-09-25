import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetLocation from './hooks/useGetLocation'
import useGetShop from './hooks/useGetShop'
import CreateUpdateShop from './pages/CreateUpdateShop'
import AddItem from './pages/AddItem'
import UpdateItem from './pages/UpdateItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemByLocation from './hooks/useGetItemByLocation'
import CartPage from './pages/CartPage'
export const serverUrl = "http://localhost:8000"

function App() {
  useGetCurrentUser();
  useGetLocation();
  useGetShop();
  useGetShopByCity();
  useGetItemByLocation();
  const {userData} = useSelector(state => state.user)
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
    </Routes>
  )
}

export default App
