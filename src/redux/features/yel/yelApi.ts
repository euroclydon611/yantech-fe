import { apiSlice } from "../api/apiSlice";

export const yelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ──────────────── CLIENTS ────────────────
    yelClientList: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/clients/list", method: "POST", body }),
    }),
    yelClientAll: builder.query<any, void>({
      query: () => ({ url: "/yel/clients/all", method: "GET" }),
    }),
    yelClientGet: builder.query<any, string>({
      query: (id) => ({ url: `/yel/clients/get/${id}`, method: "GET" }),
    }),
    yelClientCreate: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/clients/store", method: "POST", body }),
    }),
    yelClientUpdate: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/clients/update/${id}`, method: "PATCH", body }),
    }),
    yelClientDelete: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/clients/delete/${id}`, method: "DELETE" }),
    }),

    // ──────────────── QUOTATIONS ────────────────
    yelQuotationList: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/quotations/list", method: "POST", body }),
    }),
    yelQuotationGet: builder.query<any, string>({
      query: (id) => ({ url: `/yel/quotations/get/${id}`, method: "GET" }),
    }),
    yelQuotationCreate: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/quotations/store", method: "POST", body }),
    }),
    yelQuotationUpdate: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/quotations/update/${id}`, method: "PATCH", body }),
    }),
    yelQuotationStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/yel/quotations/status/${id}`, method: "PATCH", body: { status } }),
    }),
    yelQuotationConvert: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/quotations/convert/${id}`, method: "POST", body }),
    }),
    yelQuotationDelete: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/quotations/delete/${id}`, method: "DELETE" }),
    }),

    // ──────────────── INVOICES ────────────────
    yelInvoiceList: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/invoices/list", method: "POST", body }),
    }),
    yelInvoiceGet: builder.query<any, string>({
      query: (id) => ({ url: `/yel/invoices/get/${id}`, method: "GET" }),
    }),
    yelInvoiceSummary: builder.query<any, void>({
      query: () => ({ url: "/yel/invoices/summary", method: "GET" }),
    }),
    yelInvoiceCreate: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/invoices/store", method: "POST", body }),
    }),
    yelInvoiceUpdate: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/invoices/update/${id}`, method: "PATCH", body }),
    }),
    yelInvoiceStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/yel/invoices/status/${id}`, method: "PATCH", body: { status } }),
    }),

    // ──────────────── RECEIPTS ────────────────
    yelReceiptList: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/receipts/list", method: "POST", body }),
    }),
    yelReceiptByInvoice: builder.query<any, string>({
      query: (invoiceId) => ({ url: `/yel/receipts/by-invoice/${invoiceId}`, method: "GET" }),
    }),
    yelReceiptGet: builder.query<any, string>({
      query: (id) => ({ url: `/yel/receipts/get/${id}`, method: "GET" }),
    }),
    yelReceiptIssue: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/receipts/issue", method: "POST", body }),
    }),
    yelReceiptVoid: builder.mutation<any, { id: string; voidReason: string }>({
      query: ({ id, voidReason }) => ({ url: `/yel/receipts/void/${id}`, method: "PATCH", body: { voidReason } }),
    }),

    // ──────────────── TAX CONFIG ────────────────
    yelTaxConfigList: builder.query<any, void>({
      query: () => ({ url: "/yel/tax-config/list", method: "GET" }),
    }),
    yelTaxConfigCreate: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/tax-config/store", method: "POST", body }),
    }),
    yelTaxConfigUpdate: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/tax-config/update/${id}`, method: "PATCH", body }),
    }),
    yelTaxConfigToggle: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/tax-config/toggle/${id}`, method: "PATCH" }),
    }),
    yelTaxConfigDelete: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/tax-config/delete/${id}`, method: "DELETE" }),
    }),
    yelTaxConfigSeed: builder.mutation<any, void>({
      query: () => ({ url: "/yel/tax-config/seed", method: "POST" }),
    }),
    yelTaxConfigPreview: builder.mutation<any, { subtotal: number }>({
      query: (body) => ({ url: "/yel/tax-config/preview", method: "POST", body }),
    }),

    // ──────────────── BANK ACCOUNTS ────────────────
    yelBankAccountList: builder.query<any, void>({
      query: () => ({ url: "/yel/bank-accounts/list", method: "GET" }),
    }),
    yelBankAccountCreate: builder.mutation<any, any>({
      query: (body) => ({ url: "/yel/bank-accounts/store", method: "POST", body }),
    }),
    yelBankAccountUpdate: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/yel/bank-accounts/update/${id}`, method: "PATCH", body }),
    }),
    yelBankAccountToggle: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/bank-accounts/toggle/${id}`, method: "PATCH" }),
    }),
    yelBankAccountDelete: builder.mutation<any, string>({
      query: (id) => ({ url: `/yel/bank-accounts/delete/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useYelClientListMutation,
  useYelClientAllQuery,
  useYelClientGetQuery,
  useYelClientCreateMutation,
  useYelClientUpdateMutation,
  useYelClientDeleteMutation,

  useYelQuotationListMutation,
  useYelQuotationGetQuery,
  useYelQuotationCreateMutation,
  useYelQuotationUpdateMutation,
  useYelQuotationStatusMutation,
  useYelQuotationConvertMutation,
  useYelQuotationDeleteMutation,

  useYelInvoiceListMutation,
  useYelInvoiceGetQuery,
  useYelInvoiceSummaryQuery,
  useYelInvoiceCreateMutation,
  useYelInvoiceUpdateMutation,
  useYelInvoiceStatusMutation,

  useYelReceiptListMutation,
  useYelReceiptByInvoiceQuery,
  useYelReceiptGetQuery,
  useYelReceiptIssueMutation,
  useYelReceiptVoidMutation,

  useYelTaxConfigListQuery,
  useYelTaxConfigCreateMutation,
  useYelTaxConfigUpdateMutation,
  useYelTaxConfigToggleMutation,
  useYelTaxConfigDeleteMutation,
  useYelTaxConfigSeedMutation,
  useYelTaxConfigPreviewMutation,

  useYelBankAccountListQuery,
  useYelBankAccountCreateMutation,
  useYelBankAccountUpdateMutation,
  useYelBankAccountToggleMutation,
  useYelBankAccountDeleteMutation,
} = yelApi;
