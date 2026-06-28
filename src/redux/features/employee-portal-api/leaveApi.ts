import { employee_portalSlice } from "../api/employee-portalSlice";

export const leaveApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    leaveRequest: builder.mutation({
      query: ({ reason, start, end, name }) => ({
        url: "/leave/create",
        method: "POST",
        body: { reason, start, end, name },
        credentials: "include" as const,
      }),
    }),

    updateRequest: builder.mutation({
      query: ({ leave_id, reason, start, end, name }) => ({
        url: "/leave/update",
        method: "PATCH",
        body: { leave_id, reason, start, end, name },
        credentials: "include" as const,
      }),
    }),

    leaveList: builder.query({
      query: ({ page, limit }) => ({
        url: `/leave/fetch_all?page=${page}&limit=${limit}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    pendingLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/leave/fetch_pending_leaves?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    approvedLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/leave/fetch_approved_leaves?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    rejectedLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/leave/fetch_rejected_leaves?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    leaveDecision: builder.mutation({
      query: ({
        leave_id,
        type,
        start,
        end,
        decision_note,
        status,
        reduction,
      }) => ({
        url: `/leave/decision`,
        method: "PATCH",
        body: { leave_id, type, start, end, decision_note, status, reduction },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useLeaveRequestMutation,
  useUpdateRequestMutation,
  useLeaveListQuery,
  useApprovedLeavesQuery,
  usePendingLeavesQuery,
  useRejectedLeavesQuery,
  useLeaveDecisionMutation,
} = leaveApi;
