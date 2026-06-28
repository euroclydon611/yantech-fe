import { apiSlice } from "../api/apiSlice";

export const rankIncrementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    rankIncrementList: builder.query<
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
        url: `/gradesincremental/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    rankFullList: builder.query({
      query: () => ({
        url: `/grades/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    rankIncrementStore: builder.mutation({
      query: ({ name, grade_ids, percentage, users, is_flat_amount_val }) => ({
        url: "/gradesincremental/store",
        method: "POST",
        body: { name, grade_ids, percentage, users, is_flat_amount_val },
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
      }
    >({
      query: ({
        idToEdit,
        name,
        basic_salary,
        allowances_ids,
        deductions_ids,
      }) => ({
        url: `/grades/update/`,
        method: "PATCH",
        body: {
          _id: idToEdit,
          name,
          basic_salary,
          allowances_ids,
          deductions_ids,
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
  }),
});

export const {
  useRankIncrementListQuery,
  useRankFullListQuery,
  useRankIncrementStoreMutation,
  useRankUpdateMutation,
  useRankDeleteMutation,
} = rankIncrementApi;
