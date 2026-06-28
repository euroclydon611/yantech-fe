import { apiSlice } from "../api/apiSlice";

export const otherDeductionReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    otherDeductionReport: builder.query<
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
        url: `/reports/reports-other-deductions?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useOtherDeductionReportQuery } = otherDeductionReportApi;
