import { get } from "http";
import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLogin, userLogout, setCsrfToken } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type LoginResponse = {
  user: any;
  token: string;
  privileges: any;
  message: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // enpoints here
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          dispatch(
            userRegistration({
              token: results.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation<LoginResponse, any>({
      query: ({ email, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          dispatch(
            userLogin({
              token: results.data.token,
              user: results.data.user,
              privileges: results.data.privileges,
              message: results.data.message,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          await dispatch(userLogout());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    getCsrfToken: builder.query({
      query: () => ({
        url: `/auth/csrf-token`,
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.csrf_token) {
            dispatch(setCsrfToken(result.data.csrf_token));
          }
        } catch {
          // silent – CSRF fetch failure handled downstream
        }
      },
    }),

    getMe: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          dispatch(
            userLogin({
              token: results.data.token || "",
              user: results.data.user,
              privileges: results.data.privileges,
              message: "User restored",
            })
          );
        } catch (error: any) {
          console.log("Failed to restore user session:", error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetCsrfTokenQuery, useGetMeQuery } =
  authApi;
