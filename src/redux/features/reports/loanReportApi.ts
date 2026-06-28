import { apiSlice } from "../api/apiSlice";

export const loanReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loanReport: builder.query<
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
        currency: string;
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
        currency,
      }) => ({
        url: `/reports/reports-loan?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useLoanReportQuery } = loanReportApi;
