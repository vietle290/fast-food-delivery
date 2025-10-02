import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    location: null,
    currentState: null,
    currentAddress: null,
    shopInCity: null,
    itemInCity: null,
    cartItems: [],
    total: 0,
    myOrders: [],
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
    setShopInCity: (state, action) => {
      state.shopInCity = action.payload;
    },
    setItemInCity: (state, action) => {
      state.itemInCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      state.total += cartItem.price * cartItem.quantity;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const cartItem = state.cartItems.find(item => item.id == id);
      if (cartItem) {
        cartItem.quantity = quantity;
      }

      state.total = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== id);

      state.total = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatuss: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find(order => order._id == orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(shopOrder => shopOrder.shop._id == shopId);
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserData, setLoading, setError, setLocation, setCurrentState, setCurrentAddress, setShopInCity, setItemInCity, addToCart, updateQuantity, removeCart, setMyOrders, addOrder, updateOrderStatuss } =
  userSlice.actions;
export default userSlice.reducer;
