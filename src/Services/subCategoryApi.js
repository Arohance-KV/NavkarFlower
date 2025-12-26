import { baseApi } from "./baseApi";

export const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET ALL SUBCATEGORIES
       GET /sub-category
    ========================== */
    getAllSubCategories: builder.query({
      query: () => "/sub-category",
      transformResponse: (response) => response.data,
      providesTags: ["SubCategory"],
    }),

    /* =========================
       GET PAGINATED SUBCATEGORIES
       GET /sub-category/paginated
    ========================== */
    getPaginatedSubCategories: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/sub-category/paginated?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data,
      providesTags: ["SubCategory"],
    }),

    /* =========================
       SEARCH SUBCATEGORIES
       GET /sub-category?q=
    ========================== */
    searchSubCategories: builder.query({
      query: (searchQuery) =>
        `/sub-category?q=${encodeURIComponent(searchQuery)}`,
      transformResponse: (response) => response.data,
      providesTags: ["SubCategory"],
    }),

    /* =========================
       GET SUBCATEGORY BY ID
       GET /sub-category/:id
    ========================== */
    getSubCategoryById: builder.query({
      query: (subcategoryId) => `/sub-category/${subcategoryId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [
        { type: "SubCategory", id },
      ],
    }),

    /* =========================
       GET SUBCATEGORIES BY CATEGORY
       GET /sub-category/category/:categoryId
    ========================== */
    getSubCategoriesByCategory: builder.query({
      query: (categoryId) =>
        `/sub-category/category/${categoryId}`,
      transformResponse: (response) => response.data,
      providesTags: ["SubCategory"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllSubCategoriesQuery,
  useGetPaginatedSubCategoriesQuery,
  useSearchSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useGetSubCategoriesByCategoryQuery,
} = subCategoryApi;
