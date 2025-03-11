import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./slices/customer/customerSlice";
import authReducer from "./slices/auth/authSlice";
import restaurantOwnerReducer from "./slices/owner/ownerSlice"; 
import restaurantReducer from "./slices/customer/restaurantSlice";
import ownerRestaurantReducer from "./slices/owner/ownerRestaurantSlice";
import orderReducer from "./slices/customer/orderSlice";
import cartReducer from "./slices/customer/cartSlice";


const store = configureStore({
    reducer: {
        auth: authReducer, 
        customer: customerReducer,
        cart: cartReducer,
        order: orderReducer,
        restaurantOwner: restaurantOwnerReducer, 
        restaurants: restaurantReducer,
        ownerRestaurants: ownerRestaurantReducer
    },
});

export default store;
