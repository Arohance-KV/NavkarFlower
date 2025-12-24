import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL ='https://mahaveer-petals.onrender.com';

// Async Thunks
export const fetchAllCategories = createAsyncThunk(
  'category/fetchAllCategories',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      let url = `${API_BASE_URL}/category`;
      if (page && limit) {
        url += `?page=${page}&limit=${limit}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchCategories = createAsyncThunk(
  'category/searchCategories',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/search?q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to search categories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Category Slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    resetCategories: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Categories
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        // Handle both paginated and non-paginated responses
        if (Array.isArray(action.payload)) {
          state.categories = action.payload;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.categories = action.payload.data;
          state.pagination = {
            page: action.payload.page || 1,
            limit: action.payload.limit || 10,
            total: action.payload.total || 0,
            totalPages: action.payload.totalPages || 0,
          };
        }
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Search Categories
    builder
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Category By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCategory, resetCategories } =
  categorySlice.actions;
export default categorySlice.reducer;