import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setItemInCity } from '../redux/slice/userSlice';

function useGetItemByLocation() {
    const dispatch = useDispatch();
    const { location, userData } = useSelector(state => state.user)
    useEffect(() => {
        if (!userData) return;
        const fetchItemByLocation = async () => {
            setLoading(true);
            try {
                if (!location) {
                    let res = await axios.get(`${serverUrl}/api/item/get-all-items`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    })
                    dispatch(setItemInCity(res.data));
                    setLoading(false);
                    return
                }
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
