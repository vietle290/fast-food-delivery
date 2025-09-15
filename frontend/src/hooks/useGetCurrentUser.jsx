import axios from 'axios';
import { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slice/userSlice';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/user/current-user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                dispatch(setUserData(response.data));
            } catch (error) {
                console.error(error);
            }
        };
        fetchCurrentUser();

    }, [])
}

export default useGetCurrentUser
