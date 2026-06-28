import { apiSlice } from "../api/apiSlice";

export const ssnitApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //============ ssf contributions ==========
    ssnitEmployerList: builder.query({
      query: () => ({
        url: `/configs/ssnit/employer/find`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    ssnitEmployeeList: builder.query({
      query: () => ({
        url: `/configs/ssnit/employee/find`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    ssnitEmployerUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/ssnit/employer/update",
        method: "PATCH",
        body: { data },
        credentials: "include",
      }),
    }),
    ssnitEmployeeUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/ssnit/employee/update",
        method: "PATCH",
        body: { data },
        credentials: "include",
      }),
    }),

    //============ tier1 and tier2 ssnitcontributions ==========
    ssnitTier1List: builder.query({
      query: () => ({
        url: `/configs/ssnit/tier1/find`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    ssnitTier2List: builder.query({
      query: () => ({
        url: `/configs/ssnit/tier2/find`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    ssnitTier1Update: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/ssnit/tier1/update",
        method: "PATCH",
        body: { data },
        credentials: "include",
      }),
    }),
    ssnitTier2Update: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/ssnit/tier2/update",
        method: "PATCH",
        body: { data },
        credentials: "include",
      }),
    }),


    contributionCeiling: builder.query({
      query: () => ({
        url: `configs/contribution_ceiling`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    contributionCeilingUpdate: builder.mutation({
      query: ({ contribution_ceiling }) => ({
        url: "/configs/contribution_ceiling",
        method: "PATCH",
        body: { contribution_ceiling },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useSsnitEmployerListQuery,
  useSsnitEmployeeListQuery,
  useSsnitEmployerUpdateMutation,
  useSsnitEmployeeUpdateMutation,

  //tier 1 and tier 2
  useSsnitTier1ListQuery,
  useSsnitTier2ListQuery,
  useSsnitTier1UpdateMutation,
  useSsnitTier2UpdateMutation,

  //ceiling
  useContributionCeilingQuery,
  useContributionCeilingUpdateMutation
} = ssnitApi;
