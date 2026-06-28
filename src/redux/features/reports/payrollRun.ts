// File: epa-fe/src/redux/features/reports/payrollRun.ts
// ⚠️ REPLACE THE ENTIRE FILE WITH THIS CONTENT

import { apiSlice } from "../api/apiSlice";

export const payrollRunApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeesWorkedHoursList: builder.query({
      query: ({ page, limit, month, year, searchTerm }) => ({
        url: `/hours?month=${month}&year=${year}&limit=${limit}&page=${page}&searchQuery=${searchTerm}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadEmployeesWorkedHours: builder.mutation({
      query: ({ year, month, hourly_doc }) => {
        const formData = new FormData();
        formData.append("year", year);
        formData.append("month", month);
        formData.append("hourly_doc", hourly_doc);
        return {
          url: "/hours",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    awardHours: builder.mutation({
      query: (data) => ({
        url: "/hours",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),

    deleteAttendanceEntry: builder.mutation({
      query: ({ date }) => ({
        url: "/hours/remove",
        method: "DELETE",
        body: { date },
        credentials: "include" as const,
      }),
    }),

    payrollRun: builder.mutation({
      query: ({
        year,
        pay_month,
        remaining_days_in_month,
        payroll_start_date,
        payroll_end_date,
        use_hourly,
      }) => ({
        url: "/reports/run",
        method: "POST",
        body: {
          year,
          pay_month,
          remaining_days_in_month,
          payroll_start_date,
          payroll_end_date,
          use_hourly,
        },
        credentials: "include" as const,
      }),
    }),

    payrollTestRun: builder.mutation({
      query: ({ year, pay_month, confirm }) => ({
        url: "/reports/final-run",
        method: "PATCH",
        body: {
          year,
          pay_month,
          confirm,
        },
        credentials: "include" as const,
      }),
    }),

    // === NEW ENTERPRISE PAYROLL ENDPOINTS ===
    getPayrollStatus: builder.query({
      query: ({ periodId }) => ({
        url: `/payroll/status/${periodId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    validatePayrollPeriod: builder.mutation({
      query: ({ periodId }) => ({
        url: `/payroll/validate/${periodId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    lockPayrollPeriod: builder.mutation({
      query: ({ periodId }) => ({
        url: `/payroll/lock`,
        method: "POST",
        body: { periodId },
        credentials: "include" as const,
      }),
    }),

    finalizePayrollPeriod: builder.mutation({
      query: ({ periodId }) => ({
        url: `/payroll/finalize`,
        method: "POST",
        body: { periodId },
        credentials: "include" as const,
      }),
    }),

    getPayrollPeriods: builder.query({
      query: ({ entityId, limit = 20, page = 1 }) => ({
        url: `/payroll/periods?entity_id=${entityId}&limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getPayrollPeriodById: builder.query({
      query: ({ periodId }) => ({
        url: `/payroll/periods/${periodId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getPayrollReport: builder.query({
      query: ({ periodId }) => ({
        url: `/payroll/report/${periodId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getPendingArrears: builder.query({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/payroll/arrears/pending?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    approveArrears: builder.mutation({
      query: ({ retroAdjustmentId }) => ({
        url: `/payroll/arrears/${retroAdjustmentId}/approve`,
        method: "POST",
        credentials: "include" as const,
      }),
    }),

    getPayrollAuditLogs: builder.query({
      query: ({ periodId, limit = 50, page = 1 }) => ({
        url: `/payroll/audit-logs/${periodId}?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // === OVERTIME ENDPOINTS (existing) ===
    overtimeRequestAdmin: builder.mutation({
      query: ({ overtime_config_id, overtime_date, employee_ids }) => ({
        url: "/users/create_approved_overtimes",
        method: "POST",
        body: { overtime_config_id, overtime_date, employee_ids },
        credentials: "include" as const,
      }),
    }),

    updateRequest: builder.mutation({
      query: ({ overtime_id, overtime_config_id, overtime_date }) => ({
        url: "/overtime/update",
        method: "PATCH",
        body: { overtime_id, overtime_config_id, overtime_date },
        credentials: "include" as const,
      }),
    }),

    pendingOvertime: builder.query({
      query: ({ limit, page, month, year }) => ({
        url: `/users/pending_overtime_requests?limit=${limit}&page=${page}&month=${month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    approvedOvertime: builder.query({
      query: ({ limit, page, month, year }) => ({
        url: `/users/approved_overtime_requests?limit=${limit}&page=${page}&month=${month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    rejectedOvertime: builder.query({
      query: ({ limit, page, month, year }) => ({
        url: `/users/rejected_overtime_requests?limit=${limit}&page=${page}&month=${month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    overtimeDecisionAdmin: builder.mutation({
      query: ({
        overtime_id,
        overtime_config_id,
        overtime_date,
        status,
        decision_note,
      }) => ({
        url: `/users/overtime_decision`,
        method: "PATCH",
        body: {
          overtime_id,
          status,
          overtime_config_id,
          overtime_date,
          decision_note,
        },
        credentials: "include" as const,
      }),
    }),

    batchOvertimesAdmin: builder.query({
      query: ({ limit, page }) => ({
        url: `/users/fetch_batch?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    batchOvertimeDecisionAdmin: builder.mutation({
      query: ({ overtime_id, status, decision_note }) => ({
        url: `/users/batch_decision`,
        method: "PATCH",
        body: {
          overtime_id,
          status,
          decision_note,
        },
        credentials: "include" as const,
      }),
    }),

    outstandingLeavePay: builder.mutation({
      query: ({ year, month, staff_ids, num_of_day }) => ({
        url: "/users/outstanding_leave",
        method: "POST",
        body: {
          year,
          month,
          staff_ids,
          num_of_day,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useOutstandingLeavePayMutation,
  useLoadEmployeesWorkedHoursMutation,
  useEmployeesWorkedHoursListQuery,
  useAwardHoursMutation,
  useDeleteAttendanceEntryMutation,
  usePayrollRunMutation,
  usePayrollTestRunMutation,
  useGetPayrollStatusQuery,
  useValidatePayrollPeriodMutation,
  useLockPayrollPeriodMutation,
  useFinalizePayrollPeriodMutation,
  useGetPayrollPeriodsQuery,
  useGetPayrollPeriodByIdQuery,
  useGetPayrollReportQuery,
  useGetPendingArrearsQuery,
  useApproveArrearsMutation,
  useGetPayrollAuditLogsQuery,
  usePendingOvertimeQuery,
  useApprovedOvertimeQuery,
  useRejectedOvertimeQuery,
  useOvertimeRequestAdminMutation,
  useOvertimeDecisionAdminMutation,
  useBatchOvertimesAdminQuery,
  useBatchOvertimeDecisionAdminMutation,
} = payrollRunApi;
