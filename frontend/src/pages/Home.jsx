import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/user/UserDashboard'
import OwnerDashboard from '../components/owner/OwnerDashboard'
import ShipperDashboard from '../components/shipper/ShipperDashboard'
function Home() {
    const {userData} = useSelector(state => state.user)
  return (
    <div className='w-[100vw] h-[100vh] pt-[100px] flex flex-col items-center bg-[#FFF9F6]'>
      {userData && userData.role === 'user' && <UserDashboard />}
      {userData && userData.role === 'owner' && <OwnerDashboard />}
      {userData && userData.role === 'shipper' && <ShipperDashboard />}     
    </div>
  )
}

export default Home
