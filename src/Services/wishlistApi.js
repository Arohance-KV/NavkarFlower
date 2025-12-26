import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       CREATE WISHLIST
       POST /wishlist/create
    ========================== */
    createWishlist: builder.mutation({
      query: ({ name, isPublic = false }) => ({
        url: "/wishlist/create",
        method: "POST",
        body: { name, isPublic },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist"],
    }),

    /* =========================
       ADD TO WISHLIST
       POST /wishlist/add
    ========================== */
    addToWishlist: builder.mutation({
      query: ({ productId, priceWhenAdded }) => ({
        url: "/wishlist/add",
        method: "POST",
        body: { productId, priceWhenAdded },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist"],
    }),

    /* =========================
       FETCH WISHLIST
       GET /wishlist
    ========================== */
    getWishlist: builder.query({
      query: () => "/wishlist",
      transformResponse: (res) => res.data,
      providesTags: ["Wishlist"],
    }),

    /* =========================
       FETCH WISHLIST COUNT
       GET /wishlist/count
    ========================== */
    getWishlistCount: builder.query({
      query: () => "/wishlist/count",
      transformResponse: (res) => res.data,
      providesTags: ["Wishlist"],
    }),

    /* =========================
       REMOVE FROM WISHLIST
       DELETE /wishlist/remove/:productId
    ========================== */
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/remove/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist"],
    }),

    /* =========================
       TOGGLE WISHLIST
       POST /wishlist/toggle
    ========================== */
    toggleWishlist: builder.mutation({
      query: ({ productId, priceWhenAdded }) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { productId, priceWhenAdded },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist"],
    }),

    /* =========================
       MOVE TO CART
       POST /wishlist/move-to-cart/:productId
    ========================== */
    moveWishlistItemToCart: builder.mutation({
      query: ({
        productId,
        quantity = 1,
        size,
        color,
        selectedImage,
      }) => ({
        url: `/wishlist/move-to-cart/${productId}`,
        method: "POST",
        body: {
          quantity,
          size,
          colorName: color?.colorName || "Default",
          colorHex: color?.colorHex || "#000000",
          selectedImage,
        },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist", "Cart"],
    }),

    /* =========================
       CLEAR WISHLIST
       DELETE /wishlist/clear
    ========================== */
    clearWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["Wishlist"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateWishlistMutation,
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useGetWishlistCountQuery,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
  useMoveWishlistItemToCartMutation,
  useClearWishlistMutation,
} = wishlistApi;
