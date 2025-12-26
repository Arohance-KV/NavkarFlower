// src/services/productApi.js
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==========================
    // PUBLIC PRODUCT APIs
    // ==========================

    getAllProducts: builder.query({
      query: () =>
        `/product`,
      transformResponse: (response) => response.data, // ✅ FIX
      providesTags: ["Product"],
    }),

    searchProducts: builder.query({
      query: ({ query, page = 1, limit = 9 }) =>
        `/product/search/${query}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    getProductsByCategory: builder.query({
      query: ({ category}) =>
        `/product/category/${category}`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    getProductsBySubcategory: builder.query({
      query: ({ subcategory, page = 1, limit = 9 }) =>
        `/product/subcategory/${subcategory}?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    getLightProducts: builder.query({
      query: ({ page = 1, limit = 12 }) =>
        `/product/public/light?page=${page}&limit=${limit}`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    // ==========================
    // PRODUCT DETAILS
    // ==========================

    getProductById: builder.query({
      query: (productId) => `/product/${productId}`,
      transformResponse: (response) => response.data, // ✅ FIX
      providesTags: (_, __, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    getProductByCode: builder.query({
      query: (productCode) => `/product/code/${productCode}`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    // ==========================
    // PRODUCT META
    // ==========================

    getAvailableSizes: builder.query({
      query: (productId) => `/product/${productId}/available-sizes`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),

    getProductStock: builder.query({
      query: (productId) => `/product/${productId}/stock`,
      transformResponse: (response) => response.data, // ✅ FIX
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySubcategoryQuery,
  useGetLightProductsQuery,
  useGetProductByIdQuery,
  useGetProductByCodeQuery,
  useGetAvailableSizesQuery,
  useGetProductStockQuery,
} = productApi;
