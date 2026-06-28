import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setCsrfToken as setMainCsrfToken } from "../auth/authSlice";
import { setCsrfToken as setEmployeeCsrfToken } from "../employee-portal-api/authSlice";

// Used only to refresh the CSRF token — always targets the main auth endpoint.
const csrfRefreshQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_PUBLIC_SERVER_URI,
  credentials: "include",
});

export function createBaseQueryWithCsrfRetry(
  baseUrl: string,
  selectCsrfToken: (state: any) => string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = selectCsrfToken(getState());
      if (token) headers.set("X-CSRF-Token", token);
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 403) {
      const errorData = result.error.data as any;
      const isCsrfError =
        errorData?.error === "CSRF token invalid" ||
        errorData?.error === "CSRF token missing";

      if (isCsrfError) {
        const csrfResult = await csrfRefreshQuery(
          { url: "auth/csrf-token", method: "GET" },
          api,
          extraOptions,
        );

        if (csrfResult.data) {
          const newToken = (csrfResult.data as any).csrf_token;
          // Update both slices — we don't know which user type is active.
          api.dispatch(setMainCsrfToken(newToken));
          api.dispatch(setEmployeeCsrfToken(newToken));
          result = await baseQuery(args, api, extraOptions);
        }
      }
    }

    return result;
  };
}
