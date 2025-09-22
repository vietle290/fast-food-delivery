import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentState, setLocation } from '../redux/slice/userSlice';

function useGetLocation() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`);
            dispatch(setLocation(result?.data?.results[0].city));
            dispatch(setCurrentState(result?.data?.results[0].country));
            dispatch(setCurrentAddress(result?.data?.results[0].address_line2 + " " + result?.data?.results[0].address_line1));
        })
    }, [userData, dispatch, apiKey])
}

export default useGetLocation
