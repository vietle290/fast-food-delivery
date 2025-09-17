import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setShopData } from '../redux/slice/ownerSlice';

function useGetShop() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/shop/get-shop`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                dispatch(setShopData(response.data));
            } catch (error) {
                console.error(error);
            }
        };
        fetchShop();

    }, [])
}

export default useGetShop
