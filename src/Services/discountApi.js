import { baseApi } from "./baseApi";

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =========================
       GET DISCOUNT BY CODE
       GET /discount/code/:code
    ========================== */
    getDiscountByCode: builder.query({
      query: (code) => `/discount/code/${code}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, code) => [
        { type: "Discount", id: code },
      ],
    }),

    /* =========================
       GET EXPIRED DISCOUNTS
       GET /discount/expired
    ========================== */
    getExpiredDiscounts: builder.query({
      query: () => "/discount/expired",
      transformResponse: (response) => response.data,
      providesTags: ["Discount"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetDiscountByCodeQuery,
  useGetExpiredDiscountsQuery,
} = discountApi;
