import React from 'react'
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-2'>
      <h1 className='text-4xl font-bold'>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button className='bg-[#F59E0B] text-white px-4 py-2 rounded-md hover:bg-[#FBBF24] transition' onClick={() => navigate(-1)}>Go Back</button>
    </div>
  )
}

export default NotFound
