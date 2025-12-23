import { createSlice } from "@reduxjs/toolkit";

const savedUserData = sessionStorage.getItem("userData")
  ? JSON.parse(sessionStorage.getItem("userData"))
  : null;

const savedCartItems = sessionStorage.getItem("cartItems")
  ? JSON.parse(sessionStorage.getItem("cartItems"))
  : [];

const total = sessionStorage.getItem("total")
  ? JSON.parse(sessionStorage.getItem("total"))
  : 0;

const userSlice = createSlice({
  name: "user",
  initialState: {
    categories: [],
    searchCategories: [],
    userData: savedUserData,
    location: null,
    currentState: null,
    currentAddress: null,
    shopInCity: null,
    itemInCity: null,
    cartItems: savedCartItems,
    total: total,
    myOrders: [],
    searchItems: null,
    socket: null,
    loading: false,
    authLoading: false,
    itemLoading: false,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.authLoading = false;
      if (action.payload) {
        sessionStorage.setItem("userData", JSON.stringify(action.payload));
      } else {
        sessionStorage.removeItem("userData");
      }
    },
    clearUserData: (state) => {
      // reset redux state
      state.userData = null;
      state.loading = false;
      state.itemLoading = false;
      state.error = null;
      state.authLoading = false;
      state.location = null;
      state.currentState = null;
      state.currentAddress = null;
      state.shopInCity = null;
      state.itemInCity = null;
      state.myOrders = [];
      state.cartItems = [];
      state.total = 0;

      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("total");
    },

    setCategoryies: (state, action) => {
      state.categories =
        typeof action.payload === "function"
          ? action.payload(state.categories)
          : action.payload;
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
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id == cartItem.id
      );
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      state.total += cartItem.price * cartItem.quantity;
      sessionStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      sessionStorage.setItem("total", JSON.stringify(state.total));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.total = 0;
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("total");
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const cartItem = state.cartItems.find((item) => item.id == id);
      if (cartItem) {
        cartItem.quantity = quantity;
      }

      state.total = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      state.total = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatuss: (state, action) => {
      const { orderId, shopId, status, assignment } = action.payload;
      const order = state.myOrders.find((order) => order._id == orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(
          (shopOrder) => shopOrder.shop._id == shopId
        );
        if (shopOrder) {
          shopOrder.status = status;
          shopOrder.assignment = assignment;
        }
      }
    },
    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status, assignment } = action.payload;
      const order = state.myOrders.find((order) => order._id == orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(
          (shopOrder) => shopOrder.shop._id == shopId
        );
        if (shopOrder) {
          shopOrder.status = status;
          shopOrder.assignment = assignment;
        }
      }
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
    setSearchCategories: (state, action) => {
      state.searchCategories =
        typeof action.payload === "function"
          ? action.payload(state.searchCategories)
          : action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setItemLoading: (state, action) => {
      state.itemLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserData,
  setLoading,
  setAuthLoading,
  setItemLoading,
  setError,
  setCategoryies,
  setLocation,
  setCurrentState,
  setCurrentAddress,
  setShopInCity,
  setItemInCity,
  addToCart,
  updateQuantity,
  removeCart,
  setMyOrders,
  addOrder,
  updateOrderStatuss,
  setSearchItems,
  setSearchCategories,
  clearUserData,
  clearCart,
  setSocket,
  updateRealtimeOrderStatus,
} = userSlice.actions;
export default userSlice.reducer;
