import { configureStore, combineReducers } from "@reduxjs/toolkit";
import wishlistReducer from "./state/wishlistSlice";
import cartReducer from "./state/cartSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
