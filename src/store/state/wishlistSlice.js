import { deleteProduct, findProductIndexById } from "../../utils";
import storage from "../../utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlist: storage.get("hospitania_wishlist") || []
}

export const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            let index = findProductIndexById(state.wishlist, action?.payload?._id);
            if (index !== -1) {
                storage.set("hospitania_wishlist", [...state.wishlist]);
                state.wishlist = [...state.wishlist];
            } else {
                storage.set("hospitania_wishlist", [...state.wishlist, action?.payload]);
                state.wishlist = [...state.wishlist, action?.payload];
            }
        },
        deleteFormWishlist: (state, action) => {
            const newwishlists = deleteProduct(state.wishlist, action.payload);
            storage.set("hospitania_wishlist", newwishlists);
            state.wishlist = [...newwishlists];
        },
        clearWishlist: (state) => {
            storage.set("hospitania_wishlist", []);
            state.wishlist = [];
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToWishlist, deleteFormWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
