import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://mahaveer-petals.onrender.com';

// ==========================
// PUBLIC THUNKS (No credentials needed)
// ==========================

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async ({ rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async ({ query, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/search/${query}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to search products');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchProductsByCategory',
  async ({ category, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/category/${category}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch products by category');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductsBySubcategory = createAsyncThunk(
  'product/fetchProductsBySubcategory',
  async ({ subcategory, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/subcategory/${subcategory}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch products by subcategory');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLightProducts = createAsyncThunk(
  'product/fetchLightProducts',
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/public/light?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch light products');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==========================
// POSSIBLY AUTHENTICATED THUNKS (Keep credentials if needed)
// ==========================

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductByCode = createAsyncThunk(
  'product/fetchProductByCode',
  async (productCode, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/code/${productCode}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch product by code');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAvailableSizes = createAsyncThunk(
  'product/fetchAvailableSizes',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/${productId}/available-sizes`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch available sizes');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductStock = createAsyncThunk(
  'product/fetchProductStock',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/${productId}/stock`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch stock');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==========================
// INITIAL STATE & SLICE
// ==========================

const initialState = {
  currentProduct: null,
  products: {
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  lightProducts: {
    data: [],
    meta: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    },
  },
  availableSizes: [],
  productStock: null,
  loading: false,
  error: null,
  status: 'idle',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    resetProducts: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    const publicCases = [
      fetchAllProducts,
      searchProducts,
      fetchProductsByCategory,
      fetchProductsBySubcategory,
      fetchLightProducts,
      fetchProductById,
      fetchProductByCode,
    ];

    publicCases.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.status = 'pending';
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.status = 'succeeded';

          if (
            thunk === fetchAllProducts ||
            thunk === searchProducts ||
            thunk === fetchProductsByCategory ||
            thunk === fetchProductsBySubcategory
          ) {
            state.products = action.payload;
          } else if (thunk === fetchLightProducts) {
            state.lightProducts = action.payload;
          } else if (thunk === fetchProductById || thunk === fetchProductByCode) {
            state.currentProduct = action.payload;
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.status = 'failed';
          state.error = action.payload;
        });
    });

    // Separate handlers for availableSizes and productStock
    builder
      .addCase(fetchAvailableSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSizes = action.payload;
      })
      .addCase(fetchAvailableSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStock.fulfilled, (state, action) => {
        state.loading = false;
        state.productStock = action.payload;
      })
      .addCase(fetchProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct, resetProducts } = productSlice.actions;
export default productSlice.reducer;