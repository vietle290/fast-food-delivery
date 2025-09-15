import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetLocation from './hooks/useGetLocation'
export const serverUrl = "http://localhost:8000"

function App() {
  useGetCurrentUser();
  useGetLocation();
  const {userData} = useSelector(state => state.user)
  return (
    <Routes>
      <Route path="/" element={userData ? <Home /> : <Navigate to={"/login"} />} />
      <Route path="/home" element={userData ? <Home /> : <Navigate to={"/login"} />} />
      <Route path="/login" element={!userData ? <Login /> : <Navigate to={"/"} />} />
      <Route path="/register" element={!userData ? <Register /> : <Navigate to={"/"} />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
    </Routes>
  )
}

export default App
