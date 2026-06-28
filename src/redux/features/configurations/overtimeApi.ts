import { apiSlice } from "../api/apiSlice";

export const overtimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    overtimeConfigList: builder.query({
      query: () => ({
        url: `/configs/overtime`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    overtimeFullList: builder.query({
      query: () => ({
        url: `users/overtime_full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    overtimeConfigUpdate: builder.mutation({
      query: (data) => ({
        url: "/configs/overtime",
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),

    overtimeEligibilityCriteriaList: builder.query({
      query: () => ({
        url: `/configs/overtime-eligibility`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    overtimeEligibilityCriteriaUpdate: builder.mutation({
      query: (data) => ({
        url: "/configs/overtime-eligibility",
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useOvertimeConfigListQuery,
  useOvertimeConfigUpdateMutation,
  useOvertimeFullListQuery,
  useOvertimeEligibilityCriteriaListQuery,
  useOvertimeEligibilityCriteriaUpdateMutation,
} = overtimeApi;
