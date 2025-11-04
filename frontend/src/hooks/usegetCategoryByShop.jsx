import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryies } from '../redux/slice/userSlice';

function useGetCategoryByShop() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user)
    const { shopData } = useSelector(state => state.owner)
    const shopId = shopData?._id;
    useEffect(() => {
        if (!userData || userData.role !== 'owner') return;
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/category/get-category-by-shop/${shopId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                dispatch(setCategoryies(response.data.categories));
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategory();

    }, [dispatch, userData, shopId]);
}

export default useGetCategoryByShop
