import React, { useEffect } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { IoLocationSharp } from 'react-icons/io5';
import { IoIosSearch } from "react-icons/io";
import { MdMyLocation } from "react-icons/md";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { setAddress, setNewLocation } from '../redux/slice/mapSlice';
import axios from 'axios';

function RecenterAutomatically({ center }) {
        const map = useMap();
        useEffect(() => {
            map.setView([center.latitude, center.longitude], map.getZoom(), { animate: true });
        }, [center,map]);
        return null;
    }

function CheckOut() {
    const {newLocation, address} = useSelector(state => state.map);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigateBack = () => {
        navigate(-1)
    }
    const onDragEnd = (e) => {
        console.log(e.target._latlng);
        dispatch(setNewLocation({ latitude: e.target._latlng.lat, longitude: e.target._latlng.lng }));
        getAddressByLatLng(e.target._latlng.lat, e.target._latlng.lng);
    }

    const getAddressByLatLng = async (latitude, longitude) => {
        try {
            const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);
                const address = result?.data?.results[0].formatted;
                dispatch(setAddress(address));
        } catch (error) {
            console.error(error);
        }
    };
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#FFF9F6] p-6'>
            <div
              className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
              onClick={handleNavigateBack}
            >
              <IoMdArrowBack
                size={30}
                className="text-[#F59E0B] hover:text-[#FBBF24]"
              />
            </div>
            <div className='w-full max-w-[900px] rounded-2xl bg-white shadow-xl space-y-6 p-6'>
                <h1 className='text-2xl font-bold text-gray-600'>CheckOut</h1>
                <section>
                    <h2 className='text-lg font-semibold text-gray-600 flex items-center gap-2'>
                        <IoLocationSharp size={20} className='text-[#F59E0B]'/> Delivery Location
                    </h2>
                    <div className='flex gap-2 mb-3'>
                        <input type='text' className='flex-1 border border-gray-400 px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]' placeholder='Enter your address' value={address}/>
                        <button className='bg-[#F59E0B] rounded-lg px-2 py-2 text-white flex items-center justify-center hover:bg-[#FBBF24] cursor-pointer'><IoIosSearch size={20}/></button>
                        <button className='bg-blue-500 rounded-lg px-2 py-2 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer'><MdMyLocation size={20}/></button>
                    </div>
                    <div className='rounded-xl border overflow-hidden'>
                        <div className='h-64 w-full flex items-center justify-center'>
                            <MapContainer className='w-full h-full' center={[newLocation?.latitude, newLocation?.longitude]} zoom={13}>
                                <TileLayer 
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <RecenterAutomatically center={newLocation} />
                                <Marker position={[newLocation?.latitude, newLocation?.longitude]} draggable eventHandlers={{dragend:onDragEnd}}/>
                            </MapContainer>
                        </div>
                    </div>
                </section>
            </div>
    </div>
  )
}

export default CheckOut
