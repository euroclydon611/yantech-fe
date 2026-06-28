import { apiSlice } from "../api/apiSlice";

export const hours_and_leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    defaultLeaveDays: builder.query({
      query: () => ({
        url: `configs/allowable_leave_default`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    defaultLeaveDaysUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/allowable_leave_default",
        method: "PATCH",
        body: { data },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),

    hoursPerDay: builder.query({
      query: () => ({
        url: `configs/hours_per_day`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    hoursPerDayUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/hours_per_day",
        method: "PATCH",
        body: { data },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),

    daysPerMonth: builder.query({
      query: () => ({
        url: `configs/days_per_month`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    daysPerMonthUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/days_per_month",
        method: "PATCH",
        body: { data },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),

    pensionAge: builder.query({
      query: () => ({
        url: `configs/pension_age`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    pensionAgeUpdate: builder.mutation({
      query: ({ data }) => ({
        url: "/configs/pension_age",
        method: "PATCH",
        body: { data },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useDefaultLeaveDaysQuery,
  useHoursPerDayQuery,
  useDefaultLeaveDaysUpdateMutation,
  useHoursPerDayUpdateMutation,
  useDaysPerMonthQuery,
  useDaysPerMonthUpdateMutation,
  usePensionAgeQuery,
  usePensionAgeUpdateMutation,
} = hours_and_leaveApi;
