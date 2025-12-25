import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==========================
    // SIGNUP
    // ==========================
    signup: builder.mutation({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response.data,
    }),

    // ==========================
    // LOGIN
    // ==========================
    login: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => response.data,
    }),

    // ==========================
    // GET PROFILE
    // ==========================
    getProfile: builder.query({
      query: () => "/auth/profile",
      transformResponse: (response) => response.data,
      providesTags: ["Auth"],
    }),

    // ==========================
    // UPDATE PROFILE
    // ==========================
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Auth"],
    }),

    // ==========================
    // GET USER BY ID
    // ==========================
    getUserById: builder.query({
      query: (userId) => `/auth/user/${userId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
} = authApi;
