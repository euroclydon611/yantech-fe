import { apiSlice } from "../api/apiSlice";

export const ssnitReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    tier_1_Report: builder.query<
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
        url: `/reports/reports-tier1?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    tier_2_Report: builder.query<
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
        url: `/reports/reports-tier2?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    tier_3_Report: builder.query<
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
        url: `/reports/reports-tier3?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useTier_1_ReportQuery,
  useTier_2_ReportQuery,
  useTier_3_ReportQuery,
} = ssnitReportApi;
