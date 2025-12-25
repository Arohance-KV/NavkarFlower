import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       ADD TO CART
       POST /cart
    ========================== */
    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Cart"],
    }),

    /* =========================
       FETCH CART DETAILS
       GET /cart/details
    ========================== */
    getCartDetails: builder.query({
      query: () => "/cart/details",
      transformResponse: (res) => res.data,
      providesTags: ["Cart"],
    }),

    /* =========================
       UPDATE CART ITEM
       PUT /cart/item/:itemId
    ========================== */
    updateCartItem: builder.mutation({
      query: ({ itemId, updates }) => ({
        url: `/cart/item/${itemId}`,
        method: "PUT",
        body: updates,
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Cart"],
    }),

    /* =========================
       REMOVE CART ITEM
       DELETE /cart/item/:itemId
    ========================== */
    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `/cart/item/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Cart"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useAddToCartMutation,
  useGetCartDetailsQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
