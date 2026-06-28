import { employee_portalSlice } from "../../api/employee-portalSlice";

export const applicationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    assignNextStage: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/assign-stage/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    assignNextStageBulk: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/assignment-plan/assign-stage-bulk`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    getHodActionRequired: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        statusFilter,
        permitType,
      }) => ({
        url: `/revenue/assignment-plan/head-assignments?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${statusFilter}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    fetchAssignmentPlanForStaff: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        statusFilter,
      }) => ({
        url: `/revenue/assignment-plan/staff-assignments?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${statusFilter}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchAssignmentPlanForStaffById: builder.query({
      query: ({ id }) => ({
        url: `/revenue/assignment-plan/staff-assignments/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchAssignmentByApplication: builder.query({
      query: ({ id }) => ({
        url: `/revenue/assignment-plan/by-application/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    officerCompleteStage: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/complete-stage/${assignmentId}`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    hodReviewCompletion: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/review-stage/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    skipAssignmentStage: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/skip-stage/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    revertStage: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/revert-stage/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    callBackAssignedStage: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/callback/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    rejectAssignmentAndApplication: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/reject-stage-and-application/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    requestReportFromClient: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/request-reports/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    acknowledgeReportFromClient: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/acknowledge-reports/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
    requestCorrectionsFromClient: builder.mutation({
      query: ({ payload, assignmentId }) => ({
        url: `/revenue/assignment-plan/request-corrections/${assignmentId}`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    addStepComment: builder.mutation({
      query: ({ comment, assignmentId }) => ({
        url: `/revenue/assignment-plan/add-comment/${assignmentId}`,
        method: "POST",
        body: { comment },
        credentials: "include",
      }),
    }),
    updateStepComment: builder.mutation({
      query: ({ comment, assignmentId, commentId }) => ({
        url: `/revenue/assignment-plan/update-comment/${assignmentId}/${commentId}`,
        method: "PATCH",
        body: { comment },
        credentials: "include",
      }),
    }),
    getAIGuidance: builder.query({
      query: ({ assignmentId }) => ({
        url: `/revenue/assignment-plan/ai-guidance/${assignmentId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    askAIQuestion: builder.mutation({
      query: ({ assignmentId, question }) => ({
        url: `/revenue/assignment-plan/ai-ask/${assignmentId}`,
        method: "POST",
        body: { question },
        credentials: "include",
      }),
    }),
    getGroupHeadAssignments: builder.query({
      query: ({ page, limit, searchTerm, statusFilter, sortOrder, sortField }) => ({
        url: `/revenue/assignment-plan/group-head-assignments?page=${page}&limit=${limit}&searchQuery=${searchTerm || ""}&status=${statusFilter || ""}&sortOrder=${sortOrder || "desc"}&sortField=${sortField || "updatedAt"}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    hodFinalApproval: builder.mutation({
      query: ({ assignmentId, notes }) => ({
        url: `/revenue/assignment-plan/hod-final-approval/${assignmentId}`,
        method: "POST",
        body: { notes },
        credentials: "include",
      }),
    }),

    // --- Delegation ---
    requestDelegation: builder.mutation({
      query: ({ assignmentId, ...body }) => ({
        url: `/revenue/assignment-plan/delegation/request/${assignmentId}`,
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    getIncomingDelegations: builder.query<any, { status?: string; page?: number; limit?: number } | undefined>({
      query: (arg) => {
        const { status = "all", page = 1, limit = 25 } = arg ?? {};
        return {
          url: `/revenue/assignment-plan/delegation/incoming?status=${status}&page=${page}&limit=${limit}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
    getMyDelegatedTasks: builder.query<any, { status?: string; page?: number; limit?: number } | undefined>({
      query: (arg) => {
        const { status = "all", page = 1, limit = 25 } = arg ?? {};
        return {
          url: `/revenue/assignment-plan/delegation/my-tasks?status=${status}&page=${page}&limit=${limit}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
    getDelegationsForAssignment: builder.query({
      query: ({ assignmentId }) => ({
        url: `/revenue/assignment-plan/delegation/by-assignment/${assignmentId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    assignDelegatedTask: builder.mutation({
      query: ({ assignmentId, delegationId, ...body }) => ({
        url: `/revenue/assignment-plan/delegation/assign/${assignmentId}/${delegationId}`,
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    completeDelegatedTask: builder.mutation({
      query: ({ assignmentId, delegationId, formData }) => ({
        url: `/revenue/assignment-plan/delegation/complete/${assignmentId}/${delegationId}`,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    cancelDelegation: builder.mutation({
      query: ({ assignmentId, delegationId, reason }) => ({
        url: `/revenue/assignment-plan/delegation/cancel/${assignmentId}/${delegationId}`,
        method: "POST",
        body: { reason },
        credentials: "include",
      }),
    }),
    getAssignmentReminders: builder.query({
      query: () => ({
        url: `/revenue/assignment-plan/reminders`,
        method: "GET",
        credentials: "include",
      }),
    }),
    requesterCompleteDelegation: builder.mutation({
      query: ({ assignmentId, delegationId, notes }) => ({
        url: `/revenue/assignment-plan/delegation/requester-complete/${assignmentId}/${delegationId}`,
        method: "POST",
        body: { notes },
        credentials: "include",
      }),
    }),
    returnAssignment: builder.mutation({
      query: ({ assignmentId, reason }) => ({
        url: `/revenue/assignment-plan/return-assignment/${assignmentId}`,
        method: "POST",
        body: { reason },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetHodActionRequiredQuery,
  useFetchAssignmentPlanForStaffQuery,
  useFetchAssignmentPlanForStaffByIdQuery,
  useFetchAssignmentByApplicationQuery,
  useAssignNextStageMutation,
  useAssignNextStageBulkMutation,
  useHodReviewCompletionMutation,
  useOfficerCompleteStageMutation,
  useSkipAssignmentStageMutation,
  useRevertStageMutation,
  useCallBackAssignedStageMutation,
  useRejectAssignmentAndApplicationMutation,
  useRequestReportFromClientMutation,
  useAcknowledgeReportFromClientMutation,
  useRequestCorrectionsFromClientMutation,
  useAddStepCommentMutation,
  useUpdateStepCommentMutation,
  useGetAIGuidanceQuery,
  useAskAIQuestionMutation,
  useGetGroupHeadAssignmentsQuery,
  useHodFinalApprovalMutation,
  useRequestDelegationMutation,
  useGetIncomingDelegationsQuery,
  useGetMyDelegatedTasksQuery,
  useGetDelegationsForAssignmentQuery,
  useAssignDelegatedTaskMutation,
  useCompleteDelegatedTaskMutation,
  useCancelDelegationMutation,
  useRequesterCompleteDelegationMutation,
  useReturnAssignmentMutation,
  useGetAssignmentRemindersQuery,
} = applicationApi;
