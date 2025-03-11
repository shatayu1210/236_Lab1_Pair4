import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';

// Create a global axios instance with consistent settings
const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

export const loginUser = createAsyncThunk(
  "customerAuth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/customers/login",
        credentials
      );

      console.log("Login API Response:", response.data);
      
      // Store in localStorage as backup
      localStorage.setItem('customerAuth', JSON.stringify({
        isAuthenticated: true,
        customer: response.data.customer
      }));

      return response.data.customer;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data.error || "Invalid email or password");
    }
  }
);


// Check Customer Authentication
export const checkCustomerAuth = createAsyncThunk(
  "customerAuth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // First try to get from server
      const response = await api.get(
        "/api/customers/check-auth"
      );
      
      console.log("Check Customer Auth Response:", response.data);
      
      if (response.data.isAuthenticated) {
        return response.data;
      }
      
      // If server says not authenticated, try backup from localStorage
      const storedAuth = localStorage.getItem('customerAuth');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.isAuthenticated) {
          return parsedAuth;
        }
      }
      
      return { isAuthenticated: false };
    } catch (error) {
      console.error("Check Customer Auth Error:", error.response?.data || error.message);
      
      // If server request fails, try backup from localStorage
      const storedAuth = localStorage.getItem('customerAuth');
      if (storedAuth) {
        return JSON.parse(storedAuth);
      }
      
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Logout Customer
export const logoutUser = createAsyncThunk(
  "customerAuth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(
        "/api/customers/logout"
      );
      
      // Clear localStorage on logout
      localStorage.removeItem('customerAuth');
      
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Owner Login
export const loginRestaurantOwner = createAsyncThunk(
  "ownerAuth/loginRestaurantOwner",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/restaurantOwners/login",
        credentials
      );
      
      // Store in localStorage as backup
      localStorage.setItem('ownerAuth', JSON.stringify({
        isAuthenticated: true,
        owner: response.data.owner
      }));
      
      return response.data.owner;
    } catch (error) {
      return rejectWithValue(error.response?.data.error || "Invalid email or password");
    }
  }
);

// Check Owner Authentication
export const checkOwnerAuth = createAsyncThunk(
  "ownerAuth/checkOwnerAuth",
  async (_, { rejectWithValue }) => {
    try {
      // First try to get from server
      const response = await api.get(
        "/api/restaurantOwners/check-auth"
      );
      
      console.log("Check Owner Auth Response:", response.data);
      
      if (response.data.isAuthenticated) {
        return response.data;
      }
      
      // If server says not authenticated, try backup from localStorage
      const storedAuth = localStorage.getItem('ownerAuth');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.isAuthenticated) {
          return parsedAuth;
        }
      }
      
      return { isAuthenticated: false };
    } catch (error) {
      console.error("Check Owner Auth Error:", error.response?.data || error.message);
      
      // If server request fails, try backup from localStorage
      const storedAuth = localStorage.getItem('ownerAuth');
      if (storedAuth) {
        return JSON.parse(storedAuth);
      }
      
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Logout Owner
export const logoutRestaurantOwner = createAsyncThunk(
  "ownerAuth/logoutRestaurantOwner",
  async (_, { rejectWithValue }) => {
    try {
      await api.post(
        "/api/restaurantOwners/logout"
      );
      
      // Clear localStorage on logout
      localStorage.removeItem('ownerAuth');
      
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    customer: null,
    restaurantOwner: null,
    isCustomerAuthenticated: false,
    isOwnerAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /** Customer Cases **/
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isCustomerAuthenticated = true;
        state.customer = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isCustomerAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(checkCustomerAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkCustomerAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isCustomerAuthenticated = action.payload.isAuthenticated;
        state.customer = action.payload.customer || null;
      })
      .addCase(checkCustomerAuth.rejected, (state, action) => {
        state.loading = false;
        state.isCustomerAuthenticated = false;
        state.customer = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isCustomerAuthenticated = false;
        state.customer = null;
        state.error = null;
      })

      /** Owner Cases **/
      .addCase(loginRestaurantOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginRestaurantOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.isOwnerAuthenticated = true;
        state.restaurantOwner = action.payload;
        state.error = null;
      })
      .addCase(loginRestaurantOwner.rejected, (state, action) => {
        state.loading = false;
        state.isOwnerAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(checkOwnerAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkOwnerAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isOwnerAuthenticated = action.payload.isAuthenticated;
        state.restaurantOwner = action.payload.owner || null;
        state.error = null;
      })
      .addCase(checkOwnerAuth.rejected, (state, action) => {
        state.loading = false;
        state.isOwnerAuthenticated = false;
        state.restaurantOwner = null;
        state.error = action.payload;
      })
      .addCase(logoutRestaurantOwner.fulfilled, (state) => {
        state.isOwnerAuthenticated = false;
        state.restaurantOwner = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;