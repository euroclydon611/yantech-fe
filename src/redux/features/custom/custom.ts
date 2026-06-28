import { revenueSlice } from "../api/revenueSlice";

export const customApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    createHsCodeCharge: builder.mutation({
      query: (payload) => ({
        url: `/hsCodes/create-charge`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateHsCodeCharge: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/hsCodes/update-charge/${id}`,
        method: "PUT",
        body: rest, 
        credentials: "include",
      }),
    }),
    

    fetchHsCodeCharges: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/hsCodes/all-charges?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    fetchCurrencies: builder.query({
      query: () => ({
        url: `/rate-card/currencies`,
        method: "GET",
        credentials: "include",
      }),
    }),

    loadCustomData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("file", doc);

        return {
          url: "/customs/files/upload",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    fetchDataFiles: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/customs/files/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteFile: builder.mutation({
      query: (fileIds) => ({
        url: `/customs/files`,
        method: "DELETE",
        body: { fileIds },
        credentials: "include",
      }),
    }),

    fetchTransactionData: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/customs/transactions/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchConsigneeReport: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/consignee/reports?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchSingleConsigneeReport: builder.query({
      query: ({ reportId }) => ({
        url: `/consignee/report?id=${reportId}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    regenerateConsigneeReport: builder.mutation({
      query: () => ({
        url: `/consignee/refresh-report`,
        method: "POST",
        // body: payload,
        credentials: "include",
      }),
    }),

    fetchConsigneeTransactions: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        reportId,
        showNonInvoiced,
      }) => ({
        url: `/consignee/report-details?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&id=${reportId}&showNonInvoiced=${showNonInvoiced}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createConsigneeInvoice: builder.mutation({
      query: (payload) => ({
        url: `/consignee-invoice/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    fetchConsigneeInvoices: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        reportId,
        status,
        consigneeId,
        dateFrom,
        dateTo,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchQuery: searchTerm || "",
          sortOrder: sortOrder || "asc",
          sortField: sortField || "code",
          id: reportId || "",
        });

        if (status) params.append("status", status);
        if (consigneeId) params.append("consigneeId", consigneeId);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        return {
          url: `/consignee-invoice/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    viewInvoice: builder.query({
      query: ({ invoiceId }) => ({
        url: `/consignee-invoice/invoice-view?id=${invoiceId}`,
        method: "GET",
        // body: payload,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateHsCodeChargeMutation,
  useUpdateHsCodeChargeMutation,
  useFetchHsCodeChargesQuery,
  useFetchCurrenciesQuery,
  useLoadCustomDataMutation,
  useFetchDataFilesQuery,
  useDeleteFileMutation,
  useFetchTransactionDataQuery,
  useFetchConsigneeReportQuery,
  useFetchSingleConsigneeReportQuery,
  useRegenerateConsigneeReportMutation,
  useFetchConsigneeTransactionsQuery,
  useCreateConsigneeInvoiceMutation,
  useFetchConsigneeInvoicesQuery,
  useViewInvoiceQuery,
} = customApi;

