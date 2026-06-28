import { apiSlice } from "../api/apiSlice";

export const mainApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registeredClientsRegister: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        startDate,
        endDate,
      }) => ({
        url: `/general/registered-clients?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    registrationAttempts: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        status,
        startDate,
        endDate,
      }) => ({
        url: `/general/registration-attempts?page=${page}&limit=${limit}&searchQuery=${searchTerm}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAttemptInvoiceDetails: builder.query<any, { invoiceNumber: string }>({
      query: ({ invoiceNumber }) => ({
        url: `/general/registration-attempts/invoice-details?invoice_number=${invoiceNumber}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    exportRegistrationAttempts: builder.query<any, { searchTerm?: string; status?: string; startDate?: string; endDate?: string }>({
      query: ({ searchTerm = "", status = "", startDate = "", endDate = "" }) => ({
        url: `/general/registration-attempts/export?searchQuery=${searchTerm}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
        responseHandler: async (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    adminCompleteRegistration: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/general/registration-attempts/${id}/complete`,
        method: "POST",
        credentials: "include",
      }),
    }),

    updateRegisteredClient: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; body: Record<string, any> }
    >({
      query: ({ id, body }) => ({
        url: `/general/registered-clients/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisteredClientsRegisterQuery,
  useRegistrationAttemptsQuery,
  useLazyGetAttemptInvoiceDetailsQuery,
  useLazyExportRegistrationAttemptsQuery,
  useAdminCompleteRegistrationMutation,
  useUpdateRegisteredClientMutation,
} = mainApi;
