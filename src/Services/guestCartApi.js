import { baseApi } from "./baseApi";

export const guestCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET GUEST CART (RAW)
       GET /cart/guest/:sessionId
    ========================== */
    getGuestCart: builder.query({
      query: (sessionId) => `/cart/guest/${sessionId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, sessionId) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       GET GUEST CART DETAILS
       GET /cart/guest/:sessionId/details
    ========================== */
    getGuestCartDetails: builder.query({
      query: (sessionId) => `/cart/guest/${sessionId}/details`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, sessionId) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       ADD ITEM TO GUEST CART
       POST /cart/guest/:sessionId
    ========================== */
    addGuestCartItem: builder.mutation({
      query: ({ sessionId, payload }) => ({
        url: `/cart/guest/${sessionId}`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       UPDATE GUEST CART ITEM
       PUT /cart/guest/:sessionId/item/:itemId
    ========================== */
    updateGuestCartItem: builder.mutation({
      query: ({ sessionId, itemId, payload }) => ({
        url: `/cart/guest/${sessionId}/item/${itemId}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       REMOVE GUEST CART ITEM
       DELETE /cart/guest/:sessionId/item/:itemId
    ========================== */
    removeGuestCartItem: builder.mutation({
      query: ({ sessionId, itemId }) => ({
        url: `/cart/guest/${sessionId}/item/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       APPLY DISCOUNT / COUPON
       POST /cart/guest/:sessionId/apply-discount
    ========================== */
    applyGuestDiscount: builder.mutation({
      query: ({ sessionId, payload }) => ({
        url: `/cart/guest/${sessionId}/apply-discount`,
        method: "POST",
        body: payload, // { code, type }
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       REMOVE DISCOUNT / COUPON
       DELETE /cart/guest/:sessionId/remove-discount
    ========================== */
    removeGuestDiscount: builder.mutation({
      query: ({ sessionId, payload }) => ({
        url: `/cart/guest/${sessionId}/remove-discount`,
        method: "DELETE",
        body: payload, // { type: "all" }
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Cart", id: sessionId },
      ],
    }),

    /* =========================
       VALIDATE GUEST CART
       POST /cart/guest/validate?sessionId=
    ========================== */
    validateGuestCart: builder.mutation({
      query: (sessionId) => ({
        url: `/cart/guest/validate?sessionId=${sessionId}`,
        method: "POST",
      }),
      transformResponse: (response) => response.data,
    }),

    /* =========================
       MERGE GUEST CART → USER
       POST /cart/merge
    ========================== */
    mergeGuestCart: builder.mutation({
      query: (payload) => ({
        url: `/cart/merge`,
        method: "POST",
        body: payload, // usually { sessionId }
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetGuestCartQuery,
  useGetGuestCartDetailsQuery,
  useAddGuestCartItemMutation,
  useUpdateGuestCartItemMutation,
  useRemoveGuestCartItemMutation,
  useApplyGuestDiscountMutation,
  useRemoveGuestDiscountMutation,
  useValidateGuestCartMutation,
  useMergeGuestCartMutation,
} = guestCartApi;
