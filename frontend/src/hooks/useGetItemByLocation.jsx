import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setItemInCity } from '../redux/slice/userSlice';

function useGetItemByLocation() {
    const dispatch = useDispatch();
    const { location, userData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchItemByLocation = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/item/get-item-by-location/${location}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                dispatch(setItemInCity(response.data));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        };
        fetchItemByLocation();

    }, [location, dispatch, userData])
}

export default useGetItemByLocation
