import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    itemCount: 0,
  },
  reducers: {
    setCartCount: (state, action) => {
      state.itemCount = action.payload;
    },
    resetCartCount: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { setCartCount, resetCartCount } = cartSlice.actions;
export default cartSlice.reducer;
