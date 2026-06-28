import { apiSlice } from "../api/apiSlice";

export const rankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    rankList: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
      }
    >({
      query: ({ page, limit, searchTerm, sortField, sortOrder }) => ({
        url: `/grades/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    rankFullList: builder.query({
      query: () => ({
        url: `/grades/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    rankStore: builder.mutation({
      query: ({
        name,
        basic_salary,
        allowances_ids,
        deductions_ids,
        hourly_rate,
        notches,
        // allowable_leave_days,
      }) => ({
        url: "/grades/store",
        method: "POST",
        body: {
          name,
          basic_salary,
          allowances_ids,
          deductions_ids,
          hourly_rate,
          notches,
          // allowable_leave_days,
        },
        credentials: "include" as const,
      }),
    }),
    rankUpdate: builder.mutation<
      any,
      {
        idToEdit: string;
        name: string;
        basic_salary: number | string;
        allowances_ids: any;
        deductions_ids: any;
        hourly_rate: string | number;
        notches: any;
        // allowable_leave_days: string | number;
      }
    >({
      query: ({
        idToEdit,
        name,
        basic_salary,
        allowances_ids,
        deductions_ids,
        hourly_rate,
        notches,
        // allowable_leave_days,
      }) => ({
        url: `/grades/update/`,
        method: "PATCH",
        body: {
          _id: idToEdit,
          name,
          basic_salary,
          allowances_ids,
          deductions_ids,
          hourly_rate,
          notches,
          // allowable_leave_days,
        },
        credentials: "include" as const,
      }),
    }),
    rankDelete: builder.mutation({
      query: (id) => ({
        url: `/grades/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    resetAllowableLeaveDays: builder.mutation({
      query: () => ({
        url: `/employees/reset_leave?all=1`,
        method: "PATCH",
        credentials: "include" as const,
      }),
    }),
    loadRanksData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/grades/load_data",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useRankListQuery,
  useRankFullListQuery,
  useRankStoreMutation,
  useRankUpdateMutation,
  useRankDeleteMutation,
  useResetAllowableLeaveDaysMutation,
  useLoadRanksDataMutation,
} = rankApi;
