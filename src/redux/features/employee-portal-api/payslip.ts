import { employee_portalSlice } from "../api/employee-portalSlice";

export const paySlipApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    paySlips: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
        month?: string;
        year?: string;
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
        url: `/reports/payslips?month=${month}&year=${year}&forecast=${forecast}&page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&currency=${currency}`,
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

    getMyPayslipsList: builder.query<
      any,
      { page?: number; limit?: number; searchQuery?: string }
    >({
      query: ({ page = 1, limit = 50, searchQuery = "" } = {}) => ({
        url: `/reports/payslips/list?page=${page}&limit=${limit}&searchQuery=${encodeURIComponent(searchQuery)}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { usePaySlipsQuery, useViewPaySlipQuery, useGetMyPayslipsListQuery } = paySlipApi;
