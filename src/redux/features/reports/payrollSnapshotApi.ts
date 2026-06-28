import { apiSlice } from "../api/apiSlice";

export const payrollSnapshotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayrollSnapshot: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        employee_ids: string[];
        payroll_start_date?: string;
        payroll_end_date?: string;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/create",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    createPayrollSnapshotForAll: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        payroll_start_date?: string;
        payroll_end_date?: string;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/create-all",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    refreshPayrollSnapshot: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        employee_id: string;
        payroll_start_date?: string;
        payroll_end_date?: string;
        preserve_verification_status?: boolean;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/refresh",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    bulkRefreshPayrollSnapshots: builder.mutation<
      any,
      | { snapshotIds: string[]; preserve_verification_status?: boolean }
      | { employeeIds: string[]; pay_month: string; year: number; preserve_verification_status?: boolean }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/bulk-refresh",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    listPayrollSnapshots: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        pay_month?: string;
        year?: number;
        employee_id?: string;
        search?: string;
        verification_status?: string;
        employee_status?: string;
        gender?: string;
        grade_id?: string;
        notch?: string;
        entity_id?: string;
        employment_type?: string;
        staff_id_start?: string;
        staff_id_end?: string;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 20,
        pay_month = "",
        year = "",
        employee_id = "",
        search = "",
        verification_status = "",
        employee_status = "",
        gender = "",
        grade_id = "",
        notch = "",
        entity_id = "",
        employment_type = "",
        staff_id_start = "",
        staff_id_end = "",
        sortBy = "staff_id",
        sortOrder = "asc",
      }) => ({
        url: `/payroll-snapshots/list?page=${page}&limit=${limit}&pay_month=${pay_month}&year=${year}&employee_id=${employee_id}&search=${encodeURIComponent(
          search
        )}&verification_status=${verification_status}&employee_status=${employee_status}&gender=${gender}&grade_id=${grade_id}&notch=${notch}&entity_id=${entity_id}&employment_type=${employment_type}&staff_id_start=${staff_id_start}&staff_id_end=${staff_id_end}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getPayrollSnapshot: builder.query<any, string>({
      query: (id) => ({
        url: `/payroll-snapshots/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    deletePayrollSnapshot: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payroll-snapshots/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    deletePayrollSnapshotsByMonth: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/delete-by-month",
        method: "DELETE",
        body: data,
        credentials: "include" as const,
      }),
    }),

    updatePayrollSnapshotStatus: builder.mutation<
      any,
      {
        id: string;
        status: string;
      }
    >({
      query: ({ id, status }) => ({
        url: `/payroll-snapshots/${id}/status`,
        method: "PATCH",
        body: { status },
        credentials: "include" as const,
      }),
    }),

    updateEmployeeVerificationStatus: builder.mutation<
      any,
      {
        snapshotId: string;
        status: string;
        notes?: string;
        verifiedByEmployeeId?: string;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/update-status",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),

    bulkUpdateEmployeeVerificationStatus: builder.mutation<
      any,
      {
        snapshotIds: string[];
        status: string;
        notes?: string;
        verifiedByEmployeeId?: string;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/bulk-update-status",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getSnapshotVerificationSummary: builder.query<
      any,
      {
        pay_month: string;
        year: number;
      }
    >({
      query: ({ pay_month, year }) => ({
        url: `/payroll-snapshots/verification/summary?pay_month=${pay_month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    validatePayrollReadiness: builder.query<
      any,
      {
        pay_month: string;
        year: number;
      }
    >({
      query: ({ pay_month, year }) => ({
        url: `/payroll-snapshots/verification/readiness?pay_month=${pay_month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    openVerificationForSnapshots: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        deadline_days?: number;
        notify_management_head?: boolean,
        auto_close?: boolean
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/open",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    closeVerificationForSnapshots: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/close",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    extendVerificationDeadline: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        additional_days?: number;
        notify_management_head?: boolean,
        auto_close?: boolean
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/extend-deadline",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),
    reopenVerificationForSnapshots: builder.mutation<
      any,
      {
        pay_month: string;
        year: number;
        deadline_days?: number;
        notify_management_head?: boolean;
        auto_close?: boolean;
      }
    >({
      query: (data) => ({
        url: "/payroll-snapshots/verification/reopen",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    exportPayrollSnapshots: builder.mutation<
      any,
      {
        pay_month?: string;
        year?: number;
        employee_id?: string;
        search?: string;
        verification_status?: string;
        employee_status?: string;
        gender?: string;
        grade_id?: string;
        notch?: string;
        entity_id?: string;
        employment_type?: string;
        staff_id_start?: string;
        staff_id_end?: string;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        pay_month = "",
        year = "",
        employee_id = "",
        search = "",
        verification_status = "",
        employee_status = "",
        gender = "",
        grade_id = "",
        notch = "",
        entity_id = "",
        employment_type = "",
        staff_id_start = "",
        staff_id_end = "",
        sortBy = "staff_id",
        sortOrder = "asc",
      }) => ({
        url: `/payroll-snapshots/export?pay_month=${pay_month}&year=${year}&employee_id=${employee_id}&search=${encodeURIComponent(
          search
        )}&verification_status=${verification_status}&employee_status=${employee_status}&gender=${gender}&grade_id=${grade_id}&notch=${notch}&entity_id=${entity_id}&employment_type=${employment_type}&staff_id_start=${staff_id_start}&staff_id_end=${staff_id_end}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreatePayrollSnapshotMutation,
  useCreatePayrollSnapshotForAllMutation,
  useRefreshPayrollSnapshotMutation,
  useBulkRefreshPayrollSnapshotsMutation,
  useListPayrollSnapshotsQuery,
  useGetPayrollSnapshotQuery,
  useDeletePayrollSnapshotMutation,
  useDeletePayrollSnapshotsByMonthMutation,
  useUpdatePayrollSnapshotStatusMutation,
  useUpdateEmployeeVerificationStatusMutation,
  useBulkUpdateEmployeeVerificationStatusMutation,
  useGetSnapshotVerificationSummaryQuery,
  useValidatePayrollReadinessQuery,
  useOpenVerificationForSnapshotsMutation,
  useCloseVerificationForSnapshotsMutation,
  useExtendVerificationDeadlineMutation,
  useReopenVerificationForSnapshotsMutation,
  useExportPayrollSnapshotsMutation,
} = payrollSnapshotApi;
