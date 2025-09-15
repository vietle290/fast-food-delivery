import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        location: null,
        loading: false,
        error: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setLocation: (state, action) => {
            state.location = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { setUserData, setLoading, setError, setLocation } = userSlice.actions;
export default userSlice.reducer;