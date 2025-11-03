import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setShopData } from '../redux/slice/ownerSlice';

function useGetShop() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        if (!userData || userData.role !== 'owner') return;
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

    }, [dispatch, userData])
}

export default useGetShop
