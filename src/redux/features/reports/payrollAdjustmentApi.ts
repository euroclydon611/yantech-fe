import { apiSlice } from "../api/apiSlice";

export const payrollAdjustmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollAdjustments: builder.query<
      any,
      {
        page: number;
        limit: number;
        searchTerm?: string;
        sortOrder?: string;
        sortField?: string;
        status?: string;
        staff_id?: string;
      }
    >({
      query: (params) => ({
        url: "/payroll-adjustments/list",
        method: "POST",
        body: {
          ...params,
          searchQuery: params.searchTerm, // Backend expects searchQuery
        },
      }),
      providesTags: ["PayrollAdjustment"],
    }),
    createPayrollAdjustment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/payroll-adjustments/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
    updatePayrollAdjustment: builder.mutation<any, any>({
      query: (body) => ({
        url: "/payroll-adjustments/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
    deletePayrollAdjustment: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/payroll-adjustments/delete/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
    bulkStorePayrollAdjustments: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/payroll-adjustments/load_data",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
    bulkDeletePayrollAdjustments: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: "/payroll-adjustments/bulk-delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
    generateGroupRetro: builder.mutation<any, any>({
      query: (body) => ({
        url: "/payroll-adjustments/generate-retro",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PayrollAdjustment"],
    }),
  }),
});

export const {
  useGetPayrollAdjustmentsQuery,
  useCreatePayrollAdjustmentMutation,
  useUpdatePayrollAdjustmentMutation,
  useDeletePayrollAdjustmentMutation,
  useBulkStorePayrollAdjustmentsMutation,
  useBulkDeletePayrollAdjustmentsMutation,
  useGenerateGroupRetroMutation,
} = payrollAdjustmentApi;
