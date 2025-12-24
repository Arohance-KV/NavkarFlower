import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL ='https://mahaveer-petals.onrender.com';

// Async Thunks
export const createWishlist = createAsyncThunk(
  'wishlist/createWishlist',
  async ({ name, isPublic = false }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, isPublic }),
      });
      if (!response.ok) throw new Error('Failed to create wishlist');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ productId, priceWhenAdded }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, priceWhenAdded }),
      });
      if (!response.ok) throw new Error('Failed to add to wishlist');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWishlistCount = createAsyncThunk(
  'wishlist/fetchWishlistCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/count`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch wishlist count');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wishlist/remove/${productId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async ({ productId, priceWhenAdded }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, priceWhenAdded }),
      });
      if (!response.ok) throw new Error('Failed to toggle wishlist item');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async (
    {
      productId,
      quantity,
      size,
      colorName,
      colorHex,
      selectedImage,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wishlist/move-to-cart/${productId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            quantity,
            size,
            colorName,
            colorHex,
            selectedImage,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to move to cart');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to clear wishlist');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  wishlist: {
    _id: null,
    user: null,
    name: '',
    items: [],
    isPublic: false,
    createdAt: null,
    updatedAt: null,
  },
  itemCount: 0,
  toggleAction: null, // 'added' | 'removed'
  moveToCartMessage: null,
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
};

// Wishlist Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearToggleAction: (state) => {
      state.toggleAction = null;
    },
    clearMoveToCartMessage: (state) => {
      state.moveToCartMessage = null;
    },
    resetWishlist: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Create Wishlist
    builder
      .addCase(createWishlist.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.itemCount = action.payload?.items?.length || 0;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.wishlist = action.payload;
        state.itemCount = action.payload?.items?.length || 0;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Wishlist Count
    builder
      .addCase(fetchWishlistCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistCount.fulfilled, (state, action) => {
        state.loading = false;
        state.itemCount = action.payload?.count || 0;
      })
      .addCase(fetchWishlistCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.itemCount = action.payload?.items?.length || 0;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle Wishlist
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.toggleAction = action.payload?.action; // 'added' | 'removed'
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Move to Cart
    builder
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload?.wishlist || state.wishlist;
        state.itemCount = action.payload?.wishlist?.items?.length || 0;
        state.moveToCartMessage = action.payload?.message;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear Wishlist
    builder
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
        state.itemCount = 0;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearToggleAction,
  clearMoveToCartMessage,
  resetWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;