import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLogin, setCsrfToken } from "../auth/authSlice";
import { RootState } from "../../store";
import offlineQueue from "@/utils/offlineQueue";

const readCsrfCookie = (): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_PUBLIC_SERVER_URI}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = readCsrfCookie() || (getState() as RootState).auth.csrfToken;
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
    return headers;
  },
});

let csrfRefreshPromise: Promise<string | null> | null = null;

const refreshCsrfToken = async (
  query: typeof baseQuery,
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<string | null> => {
  if (!csrfRefreshPromise) {
    csrfRefreshPromise = (async () => {
      try {
        const result = await query({ url: "/auth/csrf-token", method: "GET" }, api, extraOptions);
        if (result.data) {
          const newToken = (result.data as any).csrf_token;
          api.dispatch(setCsrfToken(newToken));
          return newToken;
        }
        return null;
      } finally {
        csrfRefreshPromise = null;
      }
    })();
  }
  return csrfRefreshPromise;
};

const baseQueryWithOfflineSupport: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!navigator.onLine) {
    const method = typeof args === 'string' ? 'GET' : (args.method || 'GET').toUpperCase();

    if (method !== 'GET') {
      offlineQueue.add(args);
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Offline. Request has been queued and will retry when connection is restored.',
          data: { offline: true, queued: true }
        } as any,
      };
    }

    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'Offline. Please check your internet connection.',
        data: { offline: true, queued: false }
      } as any,
    };
  }

  offlineQueue.processQueue(baseQuery, api);

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const errorData = result.error.data as any;
    const isCsrfError =
      errorData?.error === 'CSRF token invalid' ||
      errorData?.error === 'CSRF token missing';

    if (isCsrfError) {
      const newToken = await refreshCsrfToken(baseQuery, api, extraOptions);
      if (newToken) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithOfflineSupport,
  tagTypes: ["EmployeeLoan", "Lender", "StaffTaxRelief", "PayrollAdjustment"],
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include",
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: "users/load",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          if (results.data.success && results.data.user) {
            dispatch(
              userLogin({
                token: results.data.token,
                user: results.data.user,
                privileges: results.data.privileges,
                message: results.data.message,
              })
            );
          }
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;