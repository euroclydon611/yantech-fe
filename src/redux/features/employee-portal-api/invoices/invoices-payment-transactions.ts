import { employee_portalSlice } from "../../api/employee-portalSlice";

export const invoicesApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchInvoices: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        paymentFor,
        assigningEntity,
        issueDateStart,
        issueDateEnd,
        startDate,
        endDate,
        paidAtStart,
        paidAtEnd,
      }) => {
        const params = new URLSearchParams({
          page: String(page || 1),
          limit: String(limit || 10),
          searchQuery: searchTerm || "",
          sortOrder: sortOrder || "desc",
          sortField: sortField || "createdAt",
          status: status || "",
          paymentFor: paymentFor || "",
          assigningEntity: assigningEntity || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          startDate: startDate || "",
          endDate: endDate || "",
          paidAtStart: paidAtStart || "",
          paidAtEnd: paidAtEnd || "",
        });
        return {
          url: `/revenue/invoice/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    fetchInvoicesStatistics: builder.query({
      query: ({
        searchTerm,
        status,
        paymentFor,
        assigningEntity,
        issueDateStart,
        issueDateEnd,
        startDate,
        endDate,
        paidAtStart,
        paidAtEnd,
      }) => {
        const params = new URLSearchParams({
          searchQuery: searchTerm || "",
          status: status || "",
          paymentFor: paymentFor || "",
          assigningEntity: assigningEntity || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          startDate: startDate || "",
          endDate: endDate || "",
          paidAtStart: paidAtStart || "",
          paidAtEnd: paidAtEnd || "",
        });
        return {
          url: `/revenue/invoice/stats?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    fetchPaymentTransactions: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        startDate,
        endDate,
      }) => ({
        url: `/revenue/payment-transactions/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    voidInvoice: builder.mutation({
      query: ({ invoiceId, reason, invoiceNumber }) => ({
        url: `/revenue/invoice/${invoiceId}/void`,
        method: "POST",
        body: { reason, invoiceNumber },
        credentials: "include",
      }),
    }),

    sendPaymentReminder: builder.mutation({
      query: ({ invoiceId }) => ({
        url: `/revenue/invoice/${invoiceId}/remind`,
        method: "POST",
        credentials: "include",
      }),
    }),

    bulkSendPaymentReminders: builder.mutation({
      query: ({ assigningEntity }: { assigningEntity?: string } = {}) => {
        const params = new URLSearchParams();
        if (assigningEntity && assigningEntity !== "all") params.set("assigningEntity", assigningEntity);
        const qs = params.toString();
        return {
          url: `/revenue/invoice/bulk-remind${qs ? `?${qs}` : ""}`,
          method: "POST",
          credentials: "include",
        };
      },
    }),

    syncInvoicePaymentStatus: builder.query({
      query: ({ invoiceId }: { invoiceId: string }) => ({
        url: `/revenue/invoice/${invoiceId}/sync-status`,
        method: "GET",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useFetchInvoicesQuery,
  useFetchInvoicesStatisticsQuery,
  useFetchPaymentTransactionsQuery,
  useVoidInvoiceMutation,
  useSendPaymentReminderMutation,
  useBulkSendPaymentRemindersMutation,
  useSyncInvoicePaymentStatusQuery,
} = invoicesApi;
