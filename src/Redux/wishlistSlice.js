import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    itemCount: 0,
  },
  reducers: {
    setWishlistCount: (state, action) => {
      state.itemCount = action.payload;
    },
    resetWishlist: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { setWishlistCount, resetWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
