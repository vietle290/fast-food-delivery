import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState: {
        shopData: null,
        loading: false,
        error: null,
    },
    reducers: {
        setShopData: (state, action) => {
            state.shopData = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { setShopData, setLoading, setError } = ownerSlice.actions;
export default ownerSlice.reducer;