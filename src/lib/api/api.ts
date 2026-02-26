import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["RegisterUser", "LoginUser", "RegisterVenor", "LoginVendor"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),

  endpoints: (build) => ({
    registerUser: build.mutation({
      query: ({ name, email, password, phone }) => ({
        url: "smilebababa/auth/register",
        method: "POST",
        body: { name, email, password, phone },
      }),
      invalidatesTags: ["RegisterUser"],
    }),

    loginUser: build.mutation({
      query: ({ email, password }) => ({
        url: "smilebaba/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["LoginUser"],
    }),

    registerVendor: build.mutation({
      query: ({ name, email, password, country, profile, companyName }) => ({
        url: "smilebaba/auth/register",
        method: "POST",
        body: { name, email, password, country, profile, companyName },
      }),
      invalidatesTags: ["RegisterUser"],
    }),

    loginVendor: build.mutation({
      query: ({ email, password }) => ({
        url: "smilebaba/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["LoginUser"],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useRegisterVendorMutation, useLoginVendorMutation } = api