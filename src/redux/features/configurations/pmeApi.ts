import { apiSlice } from "../api/apiSlice";

export const pmeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    pmeList: builder.query<
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
        url: `/pme/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    pmeFullList: builder.query({
      query: () => ({
        url: `/pme/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    pmeStore: builder.mutation({
      query: ({
        name,
        level,
        type,
        allowance_uom,
        allowance_amount,
        from_date,
        to_date,
        users,
        allowance_percentage,
        allowance_percentage_to,
        allowance_perc_allowances_ids,
        allowance_category,
        deduction_uom,
        deduction_amount,
        deduction_percentage,
        deduction_percentage_to,
        deduction_perc_allowances_ids,
        deduction_category,
        bonus_amount,
      }) => ({
        url: "/pme/store",
        method: "POST",
        body: {
          name,
          level,
          type,
          allowance_uom,
          allowance_amount,
          from_date,
          to_date,
          users,
          allowance_percentage,
          allowance_percentage_to,
          allowance_perc_allowances_ids,
          allowance_category,
          deduction_uom,
          deduction_amount,
          deduction_percentage,
          deduction_percentage_to,
          deduction_perc_allowances_ids,
          deduction_category,
          bonus_amount,
        },
        credentials: "include",
      }),
    }),
    pmeUpdate: builder.mutation({
      query: ({
        idToEdit,
        name,
        level,
        type,
        allowance_uom,
        allowance_amount,
        from_date,
        to_date,
        users: employees,
        allowance_percentage,
        allowance_percentage_to,
        allowance_perc_allowances_ids,
        allowance_category,
        deduction_uom,
        deduction_amount,
        deduction_percentage,
        deduction_percentage_to,
        deduction_perc_allowances_ids,
        deduction_category,
        bonus_amount,
      }) => ({
        url: `/pme/update`,
        method: "PATCH",
        body: {
          _id: idToEdit,
          name,
          level,
          type,
          allowance_uom,
          allowance_amount,
          from_date,
          to_date,
          users: employees,
          allowance_percentage,
          allowance_percentage_to,
          allowance_perc_allowances_ids,
          allowance_category,
          deduction_uom,
          deduction_amount,
          deduction_percentage,
          deduction_percentage_to,
          deduction_perc_allowances_ids,
          deduction_category,
          bonus_amount,
        },
        credentials: "include",
      }),
    }),
    pmeDelete: builder.mutation({
      query: (id) => ({
        url: `/pme/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    pmeBulkDelete: builder.mutation({
      query: (ids) => ({
        url: "/pme/bulk-delete",
        method: "DELETE",
        body: { ids },
        credentials: "include",
      }),
    }),
    pmeSingle: builder.query({
      query: (id) => ({
        url: `/pme/get_data/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    bulkStoreDeductions: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/pme/bulk-store-deductions",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    bulkStoreAllowances: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/pme/bulk-store-allowances",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    bulkStoreTier3: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/pme/bulk-store-tier-3",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  usePmeListQuery,
  usePmeFullListQuery,
  usePmeStoreMutation,
  usePmeUpdateMutation,
  usePmeDeleteMutation,
  usePmeBulkDeleteMutation,
  usePmeSingleQuery,
  useBulkStoreDeductionsMutation,
  useBulkStoreAllowancesMutation,
  useBulkStoreTier3Mutation,
} = pmeApi;
