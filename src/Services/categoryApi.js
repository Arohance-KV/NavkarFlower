import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==========================
    // GET ALL CATEGORIES
    // ==========================
    getAllCategories: builder.query({
      query: ({ page, limit } = {}) => {
        let url = "/category";
        if (page && limit) {
          url += `?page=${page}&limit=${limit}`;
        }
        return url;
      },
      transformResponse: (response) => response.data, // ✅ normalize
      providesTags: ["Category"],
    }),

    // ==========================
    // SEARCH CATEGORIES
    // ==========================
    searchCategories: builder.query({
      query: (searchQuery) =>
        `/category/search?q=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response) => response.data,
    }),

    // ==========================
    // CATEGORY BY ID
    // ==========================
    getCategoryById: builder.query({
      query: (categoryId) => `/category/${categoryId}`,
      transformResponse: (response) => response.data,
      providesTags: (_, __, id) => [{ type: "Category", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllCategoriesQuery,
  useSearchCategoriesQuery,
  useGetCategoryByIdQuery,
} = categoryApi;
