import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopInCity, setLoading } from '../redux/slice/userSlice';

function useGetShopByCity() {
    const dispatch = useDispatch();
    const { location, userData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchShopByCity = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${serverUrl}/api/shop/get-shop-by-city/${location}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                dispatch(setShopInCity(response.data));
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        };
        fetchShopByCity();

    }, [location, dispatch, userData])
}

export default useGetShopByCity
