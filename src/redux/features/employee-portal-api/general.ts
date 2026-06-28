import { use } from "passport";
import { employee_portalSlice } from "../api/employee-portalSlice";

export const mainApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDashboardStats: builder.query({
      query: ({ startDate, endDate, period }) => ({
        url: `/dashboard/stats?startDate=${startDate}&endDate=${endDate}&period=${period}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    fetchEmployeeIndustries: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/revenue/industry/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    hsCodesChargesList: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/revenue/hsCodes/all-charges?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchRegisteredClients: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        startDate,
        endDate,
        status,
      }) => ({
        url: `/registered-clients/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&startDate=${startDate}&endDate=${endDate}&status=${status || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    serviceCodesFullList: builder.query({
      query: () => ({
        url: `/general/service-codes`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    serviceChargesFullList: builder.query({
      query: () => ({
        url: `/general/service-charges`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    reportTemplatesFullList: builder.query({
      query: () => ({
        url: `/general/requested-reports`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    registerFCMToken: builder.mutation({
      query: ({ fcmToken }) => ({
        url: "/fcm/register-token",
        method: "POST",
        body: { fcmToken },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useFetchDashboardStatsQuery,
  useFetchEmployeeIndustriesQuery,
  useHsCodesChargesListQuery,
  useFetchRegisteredClientsQuery,
  useRegisterFCMTokenMutation,

  useServiceCodesFullListQuery,
  useServiceChargesFullListQuery,
  useReportTemplatesFullListQuery,
} = mainApi;
