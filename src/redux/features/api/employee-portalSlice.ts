import { createApi } from "@reduxjs/toolkit/query/react";
import { employeeLogin } from "../employee-portal-api/authSlice";
import { createBaseQueryWithCsrfRetry } from "./baseQueryWithCsrfRetry";

export const employee_portalSlice = createApi({
  reducerPath: "employee-api",
  tagTypes: ["Application", "SubordinateStaff", "VideoEpisode"],
  baseQuery: createBaseQueryWithCsrfRetry(
    import.meta.env.VITE_PUBLIC_SERVER_URI_HR,
    (state) => state.employee_auth.csrfToken,
  ),
  endpoints: (builder) => ({
    loadEmployee: builder.query({
      query: () => ({
        url: "/auth/load",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          dispatch(
            employeeLogin({
              token: results.data.token,
              employee: results.data.employee,
              message: results.data.message,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useLoadEmployeeQuery } = employee_portalSlice;
