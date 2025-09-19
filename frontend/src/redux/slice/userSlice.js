import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    location: null,
    currentState: null,
    currentAddress: null,
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
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserData, setLoading, setError, setLocation, setCurrentState, setCurrentAddress } =
  userSlice.actions;
export default userSlice.reducer;
