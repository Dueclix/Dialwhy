import { deleteProduct, findProductIndexById } from "../../utils";
import storage from "../../utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: storage.get("hospitania_cart") || []
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {

            console.log('action?.payload?.varient',action?.payload?.varient);

            let quantity = action.payload.quantity ? action.payload.quantity : 1;
            let varient = undefined;
            if ((action?.payload?.varient !== undefined || action?.payload?.varient !== null) && action?.payload?.product?.varient && action?.payload?.product?.varient.length > 0) {
                varient = action?.payload?.product?.varient[action?.payload?.varient]
            }

            let index = findProductIndexById(state.cart, action?.payload?.product?._id);

            if (index !== -1) {
                state.cart[index].quantity += quantity
                if(varient){
                    state.cart[index] = {...state.cart[index], ...varient}
                }
                storage.set("hospitania_cart", [...state.cart]);
                state.cart = [...state.cart];
            } else {

                let cartItem = {
                    "_id": action?.payload?.product?._id,
                    "title": action?.payload?.product?.title,
                    "slug": action?.payload?.product?.slug,
                    "category": action?.payload?.product?.category,
                    "image": action?.payload?.product?.image,
                    "quantity": quantity,
                }

                if(varient){
                    cartItem = { ...cartItem, ...varient }
                }

                storage.set("hospitania_cart", [...state.cart, cartItem]);
                state.cart = [...state.cart, cartItem];
            }
        },
        deleteFormCart: (state, action) => {
            console.log('action.payload', action.payload);
            const newcarts = deleteProduct(state.cart, action.payload);
            storage.set("hospitania_cart", newcarts);

            state.cart = [...newcarts];
        },
        increaseQuantity: (state, action) => {
            console.log('action.payload', action.payload);
            let index = findProductIndexById(state.cart, action.payload);
            if (index === -1) {
                return
            }

            state.cart[index].quantity += 1;
            storage.set("hospitania_cart", [...state.cart]);
            state.cart = [...state.cart];
        },
        decreaseQuantity: (state, action) => {
            let index = findProductIndexById(state.cart, action.payload);
            if (index === -1) {
                return
            }

            const quantity = state.cart[index].quantity;
            if (quantity > 1) state.cart[index].quantity -= 1;
            storage.set("hospitania_cart", [...state.cart]);
            state.cart = [...state.cart];
        },
        clearCart: (state) => {
            storage.set("hospitania_cart", []);
            state.cart = [];
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToCart, deleteFormCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
