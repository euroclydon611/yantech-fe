import { apiSlice } from "../api/apiSlice";

export const paySlipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    paySlipReport: builder.query<
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
      }) => ({
        url: `/reports/reports-payslip?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    viewPaySlip: builder.query<
      any,
      {
        month: string;
        year: string;
        forecast: number | string;
        staff_id?: string;
      }
    >({
      query: ({ month, year, forecast, staff_id }) => ({
        url: `/reports/view-pay-slip-pdf?month=${month}&year=${year}&forecast=${forecast}&staff_id=${staff_id}`,

        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { usePaySlipReportQuery, useViewPaySlipQuery } = paySlipApi;
