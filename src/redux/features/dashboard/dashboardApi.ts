import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dashboardData: builder.query({
      query: (data) => ({
        url: "/admins/dashboard",
        method: "GET",
        credentials: "include",
      }),
    }),
    reportsDashboardData: builder.query({
      query: ({ year, pay_month, forecast = 0 }) => ({
        url: `/reports/reports-dashboard?year=${year}&pay_month=${pay_month}&forecast=${forecast}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useDashboardDataQuery, useReportsDashboardDataQuery } =
  dashboardApi;
