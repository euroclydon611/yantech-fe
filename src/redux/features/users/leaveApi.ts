import { apiSlice } from "../api/apiSlice";

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    pendingLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/users/pending_leave_requests?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    approvedLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/users/approved_leave_requests?limit=${limit}&page=${page}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    rejectedLeaves: builder.query({
      query: ({ limit, page }) => ({
        url: `/users/rejected_leave_requests?limit=${limit}&page=${page}`,
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
        url: `/users/leave_decision/`,
        method: "PATCH",
        body: { leave_id, type, start, end, decision_note, status, reduction },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  usePendingLeavesQuery,
  useLeaveDecisionMutation,
  useApprovedLeavesQuery,
  useRejectedLeavesQuery,
} = leaveApi;
