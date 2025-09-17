import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice.js";
import ownerSlice from "./slice/ownerSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
  },
});