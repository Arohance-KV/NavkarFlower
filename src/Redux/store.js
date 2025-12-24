import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import subcategoryReducer from "./subcategorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    subcategory: subcategoryReducer,
  },
});

export default store;