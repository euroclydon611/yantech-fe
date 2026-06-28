import { apiSlice } from "../api/apiSlice";

export const summaryPayApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    summaryPayReport: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
        month: string;
        year: string;
        forecast: number | string;
        currency: string
      }
    >({
      query: ({
        page,
        limit,
        searchTerm,
        sortField,
        sortOrder,
        month,
        year,
        forecast,
        currency
      }) => ({
        url: `/reports/reports-bank-summary?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useSummaryPayReportQuery } = summaryPayApi;
