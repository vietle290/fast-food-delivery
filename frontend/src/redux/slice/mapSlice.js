import { createSlice } from "@reduxjs/toolkit";

const MapSlice
 = createSlice({
  name: "map",
  initialState: {
    newLocation: {
      latitude: null,
      longitude: null
    },
    address: null
  },
  reducers: {
    setNewLocation: (state, action) => {
      const { latitude, longitude } = action.payload;
      state.newLocation = { latitude, longitude };
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const {setAddress, setNewLocation} =
  MapSlice
  .actions;
export default MapSlice
.reducer;
