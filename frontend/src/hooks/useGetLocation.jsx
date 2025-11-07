// import axios from 'axios';
// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { setCurrentAddress, setCurrentState, setLocation } from '../redux/slice/userSlice';
// import { setAddress, setNewLocation } from '../redux/slice/mapSlice';

// function useGetLocation() {
//     const dispatch = useDispatch();
//     const {userData} = useSelector(state => state.user)
//     dispatch(setNewLocation({ latitude: userData?.location.coordinates[1], longitude: userData?.location.coordinates[0]  }));
//     const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//             const { latitude, longitude } = position.coords;
//             dispatch(setNewLocation({ latitude, longitude }));
//             const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);
//             dispatch(setLocation(result?.data?.results[0].city || result?.data?.results[0].county));
//             dispatch(setCurrentState(result?.data?.results[0].country));
//             dispatch(setCurrentAddress(result?.data?.results[0].formatted));
//             dispatch(setAddress(result?.data?.results[0].county + ", " + result?.data?.results[0].formatted));
//             console.log(result?.data?.results[0].county);
//         })
//     }, [userData])
// }

// export default useGetLocation

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentState,
  setLocation,
} from "../redux/slice/userSlice";
import { setAddress, setNewLocation } from "../redux/slice/mapSlice";

function useGetLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    const fetchLocation = async (latitude, longitude) => {
      try {
        const res = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
        );
        const data = res?.data?.results?.[0];
        if (!data) return;

        dispatch(setLocation(data.city || data.county));
        dispatch(setCurrentState(data.country));
        dispatch(setCurrentAddress(data.formatted));
        dispatch(setAddress(`${data.county || ""}, ${data.formatted}`));
        dispatch(setNewLocation({ latitude, longitude }));
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    };

    if (!userData) return;

    if (userData?.location?.coordinates?.length === 2) {
      const [lng, lat] = userData.location.coordinates;
      fetchLocation(lat, lng);
    }

    // Try to get client geolocation
    navigator.geolocation.getCurrentPosition(
      //  Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocation(latitude, longitude);
      },
      //  Error callback → fallback to userData location
      (error) => {
        console.log("Geolocation error:", error.message);
        if (userData?.location?.coordinates?.length === 2) {
          const [lng, lat] = userData.location.coordinates;
          fetchLocation(lat, lng);
        }
      }
    );
  }, [userData, dispatch, apiKey]);
}

export default useGetLocation;
