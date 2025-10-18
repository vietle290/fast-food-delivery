import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState: {
        shopData: null,
        avaibleShippers: [],
        loading: false,
        error: null,
    },
    reducers: {
        setShopData: (state, action) => {
            state.shopData = action.payload;
        },
        setAvailableShippers: (state, action) => {
            state.avaibleShippers = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { setShopData, setLoading, setError, setAvailableShippers } = ownerSlice.actions;
export default ownerSlice.reducer;