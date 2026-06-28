import { employee_portalSlice } from "../../api/employee-portalSlice";

export const applicationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    issuePermit: builder.mutation({
      query: ({ payload }) => {
        return {
          url: `/authorization/permits/issue`,
          method: "POST",
          body: payload,
          credentials: "include" as const,
        };
      },
    }),

    fetchIssuedPermits: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        status,
        startDate,
        endDate,
        issuedBy,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
        assigningEntity,
      }) => {
        const params = new URLSearchParams({
          page: String(page || 1),
          limit: String(limit || 10),
          searchQuery: searchTerm || "",
          sortOrder: sortOrder || "",
          sortField: sortField || "",
          permitType: permitType || "",
          status: status || "",
          startDate: startDate || "",
          endDate: endDate || "",
          issuedBy: issuedBy || "",
          expiringInDays: expiringInDays || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          expiryDateStart: expiryDateStart || "",
          expiryDateEnd: expiryDateEnd || "",
          assigningEntity: assigningEntity || "",
        });
        return {
          url: `/authorization/permits/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    fetchSingleIssuedPermit: builder.query({
      query: ({ id, applicationId }) => ({
        url: `/authorization/permits/one/?applicationId=${applicationId}&id=${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    //fetch the sections of a permit
    fetchIssuedPermitSections: builder.query({
      query: ({ id }) => ({
        url: `/authorization/permits/sections?permitId=${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    editIssuedPermitSections: builder.mutation({
      query: ({ payload, id }) => {
        return {
          url: `/authorization/permits/sections/multiple?permitId=${id}`,
          method: "PUT",
          body: payload,
          credentials: "include" as const,
        };
      },
    }),

    // ============== License routes ==================
    issueLicense: builder.mutation({
      query: ({ payload }) => {
        return {
          url: `/authorization/licenses/issue`,
          method: "POST",
          body: payload,
          credentials: "include" as const,
        };
      },
    }),

    fetchSingleIssuedLicense: builder.query({
      query: ({ id, applicationId }) => ({
        url: `/authorization/licenses/one/?applicationId=${applicationId}&id=${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchIssuedLicenses: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        licenseType,
        status,
        startDate,
        endDate,
        clientId,
        assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
      }) => {
        const params = new URLSearchParams({
          page: String(page || 1),
          limit: String(limit || 10),
          searchQuery: searchTerm || "",
          sortOrder: sortOrder || "asc",
          sortField: sortField || "",
          licenseType: licenseType || "",
          status: status || "",
          startDate: startDate || "",
          endDate: endDate || "",
          clientId: clientId || "",
          assigningEntity: assigningEntity || "",
          expiringInDays: expiringInDays || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          expiryDateStart: expiryDateStart || "",
          expiryDateEnd: expiryDateEnd || "",
        });
        return {
          url: `/authorization/licenses/all?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    //fetch the sections of a license
    fetchIssuedLicenseSections: builder.query({
      query: ({ id }) => ({
        url: `/authorization/licenses/sections?licenseId=${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    editIssuedLicenseSections: builder.mutation({
      query: ({ payload, id }) => {
        return {
          url: `/authorization/licenses/sections/multiple?licenseId=${id}`,
          method: "PUT",
          body: payload,
          credentials: "include" as const,
        };
      },
    }),

    issuePermitCertificate: builder.mutation({
      query: ({ payload }) => {
        return {
          url: `/revenue/certificate/issue`,
          method: "POST",
          body: payload,
          credentials: "include" as const,
        };
      },
    }),

    approveAndSignPermit: builder.mutation({
      query: ({ permitId, employeeId, approvalNotes }) => {
        return {
          url: `/revenue/permit/sign/${permitId}`,
          method: "POST",
          body: { employeeId, approvalNotes },
          credentials: "include" as const,
        };
      },
    }),

    approveLicenseCertificate: builder.mutation({
      query: ({ licenseId, employeeId, approvalNotes }) => {
        return {
          url: `/authorization/licenses/approve/${licenseId}`,
          method: "POST",
          body: { employeeId, approvalNotes },
          credentials: "include" as const,
        };
      },
    }),

    fetchPermitsStatistics: builder.query({
      query: ({
        searchTerm,
        permitType,
        status,
        startDate,
        endDate,
        assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
      }) => {
        const params = new URLSearchParams({
          searchQuery: searchTerm || "",
          permitType: permitType || "",
          status: status || "",
          startDate: startDate || "",
          endDate: endDate || "",
          assigningEntity: assigningEntity || "",
          expiringInDays: expiringInDays || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          expiryDateStart: expiryDateStart || "",
          expiryDateEnd: expiryDateEnd || "",
        });
        return {
          url: `/authorization/permits/stats?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),

    fetchLicensesStatistics: builder.query({
      query: ({
        searchTerm,
        licenseType,
        status,
        startDate,
        endDate,
        assigningEntity,
        expiringInDays,
        issueDateStart,
        issueDateEnd,
        expiryDateStart,
        expiryDateEnd,
      }) => {
        const params = new URLSearchParams({
          searchQuery: searchTerm || "",
          licenseType: licenseType || "",
          status: status || "",
          startDate: startDate || "",
          endDate: endDate || "",
          assigningEntity: assigningEntity || "",
          expiringInDays: expiringInDays || "",
          issueDateStart: issueDateStart || "",
          issueDateEnd: issueDateEnd || "",
          expiryDateStart: expiryDateStart || "",
          expiryDateEnd: expiryDateEnd || "",
        });
        return {
          url: `/authorization/licenses/stats?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useIssuePermitMutation,
  useFetchIssuedPermitsQuery,
  useFetchSingleIssuedPermitQuery,
  useFetchIssuedPermitSectionsQuery,
  useEditIssuedPermitSectionsMutation,

  // license routes
  useFetchIssuedLicensesQuery,
  useIssueLicenseMutation,
  useFetchSingleIssuedLicenseQuery,
  useFetchIssuedLicenseSectionsQuery,
  useEditIssuedLicenseSectionsMutation,
  //
  useIssuePermitCertificateMutation,
  useApproveAndSignPermitMutation,
  useApproveLicenseCertificateMutation,

  useFetchPermitsStatisticsQuery,
  useFetchLicensesStatisticsQuery,
} = applicationApi;
