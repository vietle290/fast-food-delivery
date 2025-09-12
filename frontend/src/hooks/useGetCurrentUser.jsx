import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App';

function useGetCurrentUser() {
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
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCurrentUser();

    }, [])
}

export default useGetCurrentUser
