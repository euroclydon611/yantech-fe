import { revenueSlice } from "../api/revenueSlice";

export const permitStatsApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermitsByMonth: builder.query<
      { labels: string[]; totals: number[]; environmental: number[]; other: number[] },
      { months?: number }
    >({
      query: ({ months = 12 } = {}) => ({
        url: `permit/stats/by-month?months=${months}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (res: any) => res.data,
    }),
    getPermitAllStats: builder.query<any, void>({
      query: () => ({
        url: "permit/stats",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useGetPermitsByMonthQuery, useGetPermitAllStatsQuery } = permitStatsApi;
