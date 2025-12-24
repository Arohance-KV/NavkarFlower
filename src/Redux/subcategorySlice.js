import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL ='https://mahaveer-petals.onrender.com';

// Async Thunks
export const fetchAllSubcategories = createAsyncThunk(
  'subcategory/fetchAllSubcategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sub-category`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPaginatedSubcategories = createAsyncThunk(
  'subcategory/fetchPaginatedSubcategories',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sub-category/paginated?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to fetch paginated subcategories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSubcategories = createAsyncThunk(
  'subcategory/searchSubcategories',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sub-category?q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to search subcategories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubcategoryById = createAsyncThunk(
  'subcategory/fetchSubcategoryById',
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sub-category/${subcategoryId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch subcategory');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubcategoriesByCategory = createAsyncThunk(
  'subcategory/fetchSubcategoriesByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sub-category/category/${categoryId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to fetch subcategories by category');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  subcategories: [],
  paginatedSubcategories: [],
  currentSubcategory: null,
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },
};

// Subcategory Slice
const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSubcategory: (state) => {
      state.currentSubcategory = null;
    },
    resetSubcategories: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Subcategories
    builder
      .addCase(fetchAllSubcategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchAllSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.subcategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Paginated Subcategories
    builder
      .addCase(fetchPaginatedSubcategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchPaginatedSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.paginatedSubcategories = action.payload?.subcategories || [];
        state.pagination = {
          page: action.payload?.currentPage || 1,
          limit: action.payload?.limit || 10,
          total: action.payload?.total || 0,
          totalPages: action.payload?.totalPages || 0,
          currentPage: action.payload?.currentPage || 1,
        };
      })
      .addCase(fetchPaginatedSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Search Subcategories
    builder
      .addCase(searchSubcategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(searchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.subcategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Subcategory By ID
    builder
      .addCase(fetchSubcategoryById.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchSubcategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.currentSubcategory = action.payload;
      })
      .addCase(fetchSubcategoryById.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });

    // Fetch Subcategories By Category
    builder
      .addCase(fetchSubcategoriesByCategory.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchSubcategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.subcategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubcategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentSubcategory, resetSubcategories } =
  subcategorySlice.actions;
export default subcategorySlice.reducer;