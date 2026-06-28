import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithCsrfRetry } from "./baseQueryWithCsrfRetry";

export const revenueSlice = createApi({
  reducerPath: "revenue",
  tagTypes: ["VideoEpisode"],
  baseQuery: createBaseQueryWithCsrfRetry(
    import.meta.env.VITE_PUBLIC_SERVER_URI_REVENUE,
    (state) => state.auth.csrfToken || state.employee_auth.csrfToken,
  ),
  endpoints: () => ({}),
});

export const {} = revenueSlice;
