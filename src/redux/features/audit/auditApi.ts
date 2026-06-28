import { apiSlice } from "../api/apiSlice";

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params) => ({
        url: "audit/logs",
        method: "GET",
        params,
      }),
      providesTags: ["AuditLogs" as any],
    }),
    getChangeHistory: builder.query({
      query: (params) => ({
        url: "audit/history",
        method: "GET",
        params,
      }),
      providesTags: ["ChangeHistory" as any],
    }),
    getRecordHistory: builder.query({
      query: ({ modelName, recordId }) => ({
        url: `audit/history/${modelName}/${recordId}`,
        method: "GET",
      }),
      providesTags: ["RecordHistory" as any],
    }),
    getSuspiciousActivities: builder.query({
      query: (params) => ({
        url: "audit/suspicious-activity",
        method: "GET",
        params,
      }),
      providesTags: ["SuspiciousActivity" as any],
    }),
    updateSuspiciousActivityStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `audit/suspicious-activity/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SuspiciousActivity" as any],
    }),
    getIntelligence: builder.query({
      query: (params) => ({
        url: "audit/intelligence",
        method: "GET",
        params,
      }),
      providesTags: ["Intelligence" as any],
    }),
    getIntelligenceStats: builder.query({
      query: () => ({ url: "audit/intelligence/stats", method: "GET" }),
      providesTags: ["IntelligenceStats" as any],
    }),
    getActorTimeline: builder.query({
      query: ({ employeeId, ...params }) => ({
        url: `audit/intelligence/actor/${employeeId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Intelligence" as any],
    }),
    getPermitSigningChain: builder.query({
      query: (permitId) => ({
        url: `audit/intelligence/permit/${permitId}`,
        method: "GET",
      }),
      providesTags: ["Intelligence" as any],
    }),
    reviewIntelligenceEvent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `audit/intelligence/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Intelligence" as any, "IntelligenceStats" as any],
    }),
    sendClientGeo: builder.mutation({
      query: (body) => ({
        url: "audit/intelligence/geo",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useGetChangeHistoryQuery,
  useGetRecordHistoryQuery,
  useGetSuspiciousActivitiesQuery,
  useUpdateSuspiciousActivityStatusMutation,
  useGetIntelligenceQuery,
  useGetIntelligenceStatsQuery,
  useGetActorTimelineQuery,
  useGetPermitSigningChainQuery,
  useReviewIntelligenceEventMutation,
  useSendClientGeoMutation,
} = auditApi;
