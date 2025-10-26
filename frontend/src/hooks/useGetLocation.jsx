import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentState, setLocation } from '../redux/slice/userSlice';
import { setAddress, setNewLocation } from '../redux/slice/mapSlice';

function useGetLocation() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude);
            dispatch(setNewLocation({ latitude, longitude }));
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);
            dispatch(setLocation(result?.data?.results[0].city || result?.data?.results[0].county));
            dispatch(setCurrentState(result?.data?.results[0].country));
            dispatch(setCurrentAddress(result?.data?.results[0].formatted));
            dispatch(setAddress(result?.data?.results[0].county + ", " + result?.data?.results[0].formatted));
            console.log(result?.data?.results[0].county);
        })
    }, [userData])
}

export default useGetLocation
