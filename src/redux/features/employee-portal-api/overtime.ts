import { employee_portalSlice } from "../api/employee-portalSlice";

export const overtimeApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchOvertimeFullList: builder.query({
      query: () => ({
        url: `overtime/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    overtimeRequest: builder.mutation({
      query: ({ overtime_config_id, overtime_date }) => ({
        url: "/overtime/create",
        method: "POST",
        body: { overtime_config_id, overtime_date },
        credentials: "include" as const,
      }),
    }),

    updateOvertimeRequest: builder.mutation({
      query: ({ overtime_id, overtime_config_id, overtime_date }) => ({
        url: "/overtime/update",
        method: "PATCH",
        body: { overtime_id, overtime_config_id, overtime_date },
        credentials: "include" as const,
      }),
    }),

    overtimeList: builder.query({
      query: ({ page, limit }) => ({
        url: `/overtime/fetch_all?page=${page}&limit=${limit}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    pendingOvertime: builder.query({
      query: ({ limit, page }) => ({
        url: `/overtime/fetch_pending_overtime?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    approvedOvertime: builder.query({
      query: ({ limit, page }) => ({
        url: `/overtime/fetch_approved_overtime?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    rejectedOvertime: builder.query({
      query: ({ limit, page }) => ({
        url: `/overtime/fetch_rejected_overtime?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    overtimeDecision: builder.mutation({
      query: ({
        overtime_id,
        overtime_config_id,
        overtime_date,
        status,
        decision_note,
      }) => ({
        url: `/overtime/decision`,
        method: "PATCH",
        body: {
          overtime_id,
          overtime_config_id,
          overtime_date,
          status,
          decision_note,
        },
        credentials: "include" as const,
      }),
    }),

    //batch overtime
    batchOvertimeRequest: builder.mutation({
      query: ({ overtime_config_id, overtime_date, employee_ids }) => ({
        url: "/overtime/create_batch",
        method: "POST",
        body: { overtime_config_id, overtime_date, employee_ids },
        credentials: "include" as const,
      }),
    }),

    updateBatchOvertimeRequest: builder.mutation({
      query: ({
        overtime_id,
        overtime_config_id,
        overtime_date,
        employee_ids,
      }) => ({
        url: "/overtime/update_batch",
        method: "PATCH",
        body: { overtime_id, overtime_config_id, overtime_date, employee_ids },
        credentials: "include" as const,
      }),
    }),

    batchOvertimes: builder.query({
      query: ({ limit, page }) => ({
        url: `/overtime/fetch_batch?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    batchOvertimeEmployees: builder.query({
      query: ({ id }) => ({
        url: `/overtime/fetch_batch_employees/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useOvertimeRequestMutation,
  useUpdateOvertimeRequestMutation,
  useOvertimeListQuery,
  useApprovedOvertimeQuery,
  usePendingOvertimeQuery,
  useRejectedOvertimeQuery,
  useOvertimeDecisionMutation,

  useFetchOvertimeFullListQuery,

  //batch overtime
  useBatchOvertimeRequestMutation,
  useUpdateBatchOvertimeRequestMutation,
  useBatchOvertimesQuery,
  useBatchOvertimeEmployeesQuery
} = overtimeApi;
