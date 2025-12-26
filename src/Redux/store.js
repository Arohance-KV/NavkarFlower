import { configureStore } from "@reduxjs/toolkit";

// Client / UI state ONLY
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";      // badge-only slice
import wishlistReducer from "./wishlistSlice";

// RTK Query base API
import { baseApi } from "../Services/baseApi";

const store = configureStore({
  reducer: {
    // RTK Query (SERVER STATE)
    [baseApi.reducerPath]: baseApi.reducer,

    // Redux (CLIENT / UI STATE)
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),

  devTools: import.meta.env.MODE !== "production",
});

export default store;
