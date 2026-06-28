import { apiSlice } from "../api/apiSlice";

export const clientApplicationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPermitApplications: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        permitType,
        assigningEntity,
        view,
        startDate,
        endDate,
      }) => ({
        url: `/general/permit-applications?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&permitType=${permitType}&assigningEntity=${assigningEntity}&view=${view}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminSinglePermitApplication: builder.query({
      query: ({ id }) => ({
        url: `/general/permit-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminAuthorizationRequests: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        permitType,
        assigningEntity,
        view,
        startDate,
        endDate,
      }) => ({
        url: `/general/authorization-requests?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&permitType=${permitType}&assigningEntity=${assigningEntity}&view=${view}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminSingleAuthorizationRequest: builder.query({
      query: ({ id }) => ({
        url: `/general/authorization-requests/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminEfficacyTrials: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        assigningEntity,
        view,
      }) => ({
        url: `/general/efficacy-trials?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&assigningEntity=${assigningEntity}&view=${view}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminSingleEfficacyTrial: builder.query({
      query: ({ id }) => ({
        url: `/general/efficacy-trials/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminLicenseApplications: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        licenseType,
        assigningEntity,
        view,
        startDate,
        endDate,
      }) => ({
        url: `/general/license-applications?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&licenseType=${licenseType}&assigningEntity=${assigningEntity}&view=${view}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminSingleLicenseApplication: builder.query({
      query: ({ id }) => ({
        url: `/general/license-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminApplicationHistory: builder.query({
      query: ({ id }) => ({
        url: `/general/application-history/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminPermitRegistry: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        permitType,
        assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
        startDate,
        endDate,
      }) => ({
        url: `/general/permit-registry?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&permitType=${permitType}&assigningEntity=${assigningEntity}&expiringInDays=${expiringInDays || ""}&issueDateStart=${issueDateStart || ""}&issueDateEnd=${issueDateEnd || ""}&expiryDateStart=${expiryDateStart || ""}&expiryDateEnd=${expiryDateEnd || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminInvoiceRegistry: builder.query({
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
      }) => ({
        url: `/general/invoice-registry?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&paymentFor=${paymentFor}&assigningEntity=${assigningEntity}&issueDateStart=${issueDateStart || ""}&issueDateEnd=${issueDateEnd || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&paidAtStart=${paidAtStart || ""}&paidAtEnd=${paidAtEnd || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminInvoiceLineItems: builder.query({
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
        dueDateStart,
        dueDateEnd,
        expiryDateStart,
        expiryDateEnd,
        serviceCodes,
      }) => ({
        url: `/general/invoice-registry/line-items?page=${page}&limit=${limit}&searchQuery=${searchTerm || ""}&sortOrder=${sortOrder || "desc"}&sortField=${sortField || "issueDate"}&status=${status || ""}&paymentFor=${paymentFor || ""}&assigningEntity=${assigningEntity || ""}&issueDateStart=${issueDateStart || ""}&issueDateEnd=${issueDateEnd || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&dueDateStart=${dueDateStart || ""}&dueDateEnd=${dueDateEnd || ""}&expiryDateStart=${expiryDateStart || ""}&expiryDateEnd=${expiryDateEnd || ""}&serviceCodes=${serviceCodes || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminInvoiceStats: builder.query({
      query: ({
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
          url: `/general/invoice-registry/stats?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    getAdminRegistryDashboard: builder.query({
      query: ({ startDate = "", endDate = "" }) => ({
        url: `/general/registry-dashboard?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAdminApplicationEntityStats: builder.query({
      query: () => ({
        url: `/general/application-entity-stats`,
        method: "GET",
        credentials: "include",
      }),
    }),

    migrateSubmissionFeeBlockers: builder.mutation({
      query: () => ({
        url: `/general/migrate-submission-fee-blockers`,
        method: "POST",
        credentials: "include",
      }),
    }),

    migrateQueuedAssignmentsToV2: builder.mutation({
      query: () => ({
        url: `/general/migrate-queued-assignments-to-v2`,
        method: "POST",
        credentials: "include",
      }),
    }),

    migrateRegistrationAttemptExpiry: builder.mutation({
      query: () => ({
        url: `/general/migrate-registration-attempt-expiry`,
        method: "POST",
        credentials: "include",
      }),
    }),

    deleteSubmittedApplication: builder.mutation<
      { success: boolean; message: string },
      { applicationType: "permit" | "authorization" | "license" | "efficacy"; id: string }
    >({
      query: ({ applicationType, id }) => ({
        url: `/general/applications/${applicationType}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    getAdminLicenseRegistry: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        status,
        licenseType,
        assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
        startDate,
        endDate,
      }) => ({
        url: `/general/license-registry?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}&licenseType=${licenseType}&assigningEntity=${assigningEntity}&expiringInDays=${expiringInDays || ""}&issueDateStart=${issueDateStart || ""}&issueDateEnd=${issueDateEnd || ""}&expiryDateStart=${expiryDateStart || ""}&expiryDateEnd=${expiryDateEnd || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    adminReverseIssuance: builder.mutation<
      { success: boolean; message: string },
      { permitId: string; reason: string }
    >({
      query: ({ permitId, reason }) => ({
        url: `/general/permits/${permitId}/reverse-issuance`,
        method: "POST",
        credentials: "include",
        body: { reason },
      }),
    }),

    adminReverseLicenseIssuance: builder.mutation<
      { success: boolean; message: string },
      { licenseId: string; reason: string }
    >({
      query: ({ licenseId, reason }) => ({
        url: `/general/licenses/${licenseId}/reverse-issuance`,
        method: "POST",
        credentials: "include",
        body: { reason },
      }),
    }),
  }),
});

export const {
  useGetAdminPermitApplicationsQuery,
  useGetAdminSinglePermitApplicationQuery,
  useGetAdminAuthorizationRequestsQuery,
  useGetAdminSingleAuthorizationRequestQuery,
  useGetAdminEfficacyTrialsQuery,
  useGetAdminSingleEfficacyTrialQuery,
  useGetAdminLicenseApplicationsQuery,
  useGetAdminSingleLicenseApplicationQuery,
  useGetAdminApplicationHistoryQuery,
  useGetAdminPermitRegistryQuery,
  useGetAdminInvoiceRegistryQuery,
  useGetAdminLicenseRegistryQuery,
  useGetAdminRegistryDashboardQuery,
  useGetAdminApplicationEntityStatsQuery,
  useMigrateSubmissionFeeBlockersMutation,
  useMigrateQueuedAssignmentsToV2Mutation,
  useMigrateRegistrationAttemptExpiryMutation,
  useDeleteSubmittedApplicationMutation,
  useGetAdminInvoiceStatsQuery,
  useGetAdminInvoiceLineItemsQuery,
  useAdminReverseIssuanceMutation,
  useAdminReverseLicenseIssuanceMutation,
} = clientApplicationsApi;
