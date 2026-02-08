import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["RegisterUser", "LoginUser", "RegisterVenor", "LoginVendor"],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.BASE_URL }),

  endpoints: (build) => ({
    registerUser: build.mutation({
      query: ({ name, email, password }) => ({
        url: "auth/register",
        method: POST,
        body: { name, email, password },
      }),
      invalidatesTags: ["RegisterUser"],
    }),

    loginUser: build.mutation({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: POST,
        body: { email, password },
      }),
      invalidatesTags: ["LoginUser"],
    }),

    registerVendor: build.mutation({
      query: ({ name, email, password, country, profile, companyName }) => ({
        url: "auth/vendor/register",
        method: POST,
        body: { name, email, password, country, profile, companyName },
      }),
      invalidatesTags: ["RegisterUser"],
    }),

    loginVendor: build.mutation({
      query: ({ email, password }) => ({
        url: "auth/vendor/login",
        method: POST,
        body: { email, password },
      }),
      invalidatesTags: ["LoginUser"],
    }),
  }),
});

export const { useRegisterUserMutation, userLoginUserMutation, useRegisterVendorMutation, userLoginVendorMutation } = api