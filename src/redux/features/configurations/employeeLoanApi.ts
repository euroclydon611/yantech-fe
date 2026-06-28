import { apiSlice } from "../api/apiSlice";

export const employeeLoanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeLoans: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string;
        searchQuery?: string;
        lender_id?: string;
        sortField?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 25,
        status = "",
        searchQuery = "",
        lender_id = "",
        sortField = "createdAt",
        sortOrder = "desc",
      }) => ({
        url: "/employee-loans/list",
        method: "POST",
        body: {
          page,
          limit,
          status,
          searchQuery,
          lender_id,
          sortField,
          sortOrder,
        },
        credentials: "include" as const,
      }),
      providesTags: ["EmployeeLoan"],
    }),

    getLoansByEmployee: builder.query<any, string>({
      query: (employeeId) => ({
        url: `/employee-loans/employee/${employeeId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["EmployeeLoan"],
    }),

    createEmployeeLoan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/employee-loans",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),

    updateEmployeeLoan: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/employee-loans/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),

    pauseEmployeeLoan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/employee-loans/${id}/pause`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),

    resumeEmployeeLoan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/employee-loans/${id}/resume`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),

    completeEmployeeLoan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/employee-loans/${id}/complete`,
        method: "PATCH",
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),

    bulkLoadLoans: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/employee-loans/load-data",
        method: "POST",
        body: formData,
        credentials: "include" as const,
      }),
      invalidatesTags: ["EmployeeLoan"],
    }),
  }),
});

export const {
  useGetEmployeeLoansQuery,
  useGetLoansByEmployeeQuery,
  useCreateEmployeeLoanMutation,
  useUpdateEmployeeLoanMutation,
  usePauseEmployeeLoanMutation,
  useResumeEmployeeLoanMutation,
  useCompleteEmployeeLoanMutation,
  useBulkLoadLoansMutation,
} = employeeLoanApi;
