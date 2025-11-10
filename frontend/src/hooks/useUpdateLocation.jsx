import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';

function useUpdateLocation() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user)

    useEffect(() => {
        if (!userData) return;
        const updateLocation = async ({ latitude, longitude }) => {
            const res = await axios.post(`${serverUrl}/api/user/update-location`, {
                latitude: latitude,
                longitude: longitude,
            }, {
                withCredentials: true,
            })
           
        }
        navigator.geolocation.watchPosition(async (position) => { // Watch for location changes
            const { latitude, longitude } = position.coords;
            await updateLocation({ latitude, longitude });
        });
    }, [userData])
}

export default useUpdateLocation
