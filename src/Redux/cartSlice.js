import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL ='https://mahaveer-petals.onrender.com';

// Async Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update item');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCartDetails = createAsyncThunk(
  'cart/fetchCartDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/details`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch cart details');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to remove item');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to validate cart');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyDiscount = createAsyncThunk(
  'cart/applyDiscount',
  async ({ code, type }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/apply-discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type }),
      });
      if (!response.ok) throw new Error('Failed to apply discount');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeDiscount = createAsyncThunk(
  'cart/removeDiscount',
  async (type = 'all', { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove-discount`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) throw new Error('Failed to remove discount');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateDiscount = createAsyncThunk(
  'cart/validateDiscount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/validate-discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to validate discount');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  cart: {
    _id: null,
    user: null,
    items: [],
    appliedCoupon: {},
    appliedVoucher: {},
    createdAt: null,
    updatedAt: null,
    expiresAt: null,
    isActive: true,
  },
  cartDetails: {
    cart: {},
    items: [],
    totals: {
      subtotal: 0,
      discountAmount: 0,
      total: 0,
      itemCount: 0,
    },
  },
  discountValidation: null,
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
};

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Cart Details
    builder
      .addCase(fetchCartDetails.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchCartDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.cartDetails = action.payload;
      })
      .addCase(fetchCartDetails.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Remove Cart Item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartDetails.items = [];
        state.cartDetails.totals = {
          subtotal: 0,
          discountAmount: 0,
          total: 0,
          itemCount: 0,
        };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Validate Cart
    builder
      .addCase(validateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartDetails = action.payload;
      })
      .addCase(validateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Apply Discount
    builder
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove Discount
    builder
      .addCase(removeDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Validate Discount
    builder
      .addCase(validateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discountValidation = action.payload;
      })
      .addCase(validateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;