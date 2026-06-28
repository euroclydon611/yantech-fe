import { apiSlice } from "../api/apiSlice";

export const staffTaxReliefApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffTaxReliefs: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string;
        searchQuery?: string;
        sortField?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 25,
        status = "",
        searchQuery = "",
        sortField = "createdAt",
        sortOrder = "desc",
      }) => ({
        url: "/staff-tax-relief/list",
        method: "POST",
        body: {
          page,
          limit,
          status,
          searchQuery,
          sortField,
          sortOrder,
        },
        credentials: "include" as const,
      }),
      providesTags: ["StaffTaxRelief"],
    }),

    getReliefsByEmployee: builder.query<any, string>({
      query: (employeeId) => ({
        url: `/staff-tax-relief/employee/${employeeId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["StaffTaxRelief"],
    }),

    createStaffTaxRelief: builder.mutation<any, any>({
      query: (data) => ({
        url: "/staff-tax-relief",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),

    updateStaffTaxRelief: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/staff-tax-relief/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),

    changeStaffTaxReliefStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/staff-tax-relief/${id}/status`,
        method: "PATCH",
        body: { status },
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),

    deleteStaffTaxRelief: builder.mutation<any, string>({
      query: (id) => ({
        url: `/staff-tax-relief/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),

    bulkLoadStaffTaxReliefs: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/staff-tax-relief/load-data",
        method: "POST",
        body: formData,
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),
    bulkDeleteStaffTaxReliefs: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: "/staff-tax-relief/bulk-delete",
        method: "DELETE",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["StaffTaxRelief"],
    }),
  }),
});

export const {
  useGetStaffTaxReliefsQuery,
  useGetReliefsByEmployeeQuery,
  useCreateStaffTaxReliefMutation,
  useUpdateStaffTaxReliefMutation,
  useChangeStaffTaxReliefStatusMutation,
  useDeleteStaffTaxReliefMutation,
  useBulkLoadStaffTaxReliefsMutation,
  useBulkDeleteStaffTaxReliefsMutation,
} = staffTaxReliefApi;
