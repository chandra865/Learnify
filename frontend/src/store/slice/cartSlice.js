import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // List of course IDs or objects
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload.courses || [];
      state.totalAmount = action.payload.totalAmount || 0;
    },
    addItemToCart: (state, action) => {
      const course = action.payload;
      const exists = state.cartItems.some((item) => (item._id || item) === (course._id || course));
      if (!exists) {
        state.cartItems.push(course);
        state.totalAmount += course.price || 0;
      }
    },
    removeItemFromCart: (state, action) => {
      const courseId = action.payload;
      const courseToRemove = state.cartItems.find((item) => (item._id || item) === courseId);
      if (courseToRemove) {
        state.totalAmount -= courseToRemove.price || 0;
        state.cartItems = state.cartItems.filter((item) => (item._id || item) !== courseId);
      }
      if (state.totalAmount < 0) state.totalAmount = 0;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("user/logout", () => initialState);
  },
});

export const { setCart, addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
