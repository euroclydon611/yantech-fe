import { employee_portalSlice } from "../../api/employee-portalSlice";

export const applicationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchApplicationsForHead: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        licenseType,
        status,
        startDate,
        endDate,
        view,
        assigningEntity,
        transferStartDate = "",
        transferEndDate = "",
        type = "permit",
      }) => ({
        url: `/revenue/application/${type}-applications?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&licenseType=${licenseType}&status=${status}&startDate=${startDate}&endDate=${endDate}&view=${view}&assigningEntity=${assigningEntity}&transferStartDate=${transferStartDate}&transferEndDate=${transferEndDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchSingleApplication: builder.query({
      query: ({ id, type = "permit" }) => ({
        url: `/revenue/application/${type}-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, { id }) => [{ type: "Application", id }],
    }),

    fetchApplications: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/revenue/application/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateApplicationSection: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/${payload.id}/update-section`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { payload }) => [
        { type: "Application", id: payload.id },
      ],
    }),

    updateChemicalRiskFlak: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/permit-applications/${payload.id}/chemical-risk-flag`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    uploadApplicationDocument: builder.mutation({
      query: ({
        formData,
        applicationType = "permit",
      }: {
        formData: FormData;
        applicationType?: string;
      }) => {
        return {
          url: `/revenue/application/${applicationType}-applications/upload-document`,
          method: "PATCH",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    removeApplicationDocument: builder.mutation({
      query: ({
        applicationId,
        documentId,
        applicationType = "permit",
      }: {
        applicationId: string;
        documentId: string;
        applicationType?: string;
      }) => {
        return {
          url: `/revenue/application/${applicationType}-applications/remove-document`,
          method: "PATCH",
          body: { applicationId, documentId },
          credentials: "include" as const,
        };
      },
    }),

    fetchAllMovementDocuments: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        status,
      }) => ({
        url: `/revenue/movement-documents/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${status}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchAllEfficacyTrials: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        status,
        view,
        assigningEntity,
      }) => ({
        url: `/revenue/application/efficacy-trial-applications?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${status}&view=${view}&assigningEntity=${assigningEntity}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchSingleEfficacyTrial: builder.query({
      query: ({ id }) => ({
        url: `/revenue/application/efficacy-trial-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateEfficacyTrial: builder.mutation({
      query: ({ id, efficacyFee, reason, status }) => ({
        url: `/revenue/application/efficacy-trial-applications/${id}`,
        method: "PATCH",
        body: { efficacyFee, reason, status },
        credentials: "include",
      }),
    }),

    transferApplication: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/${payload.id}/transfer`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    updateScaleAndLocation: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/${payload.id}/scale-location`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { payload }) => [
        { type: "Application", id: payload.id },
      ],
    }),

    fetchApplicationEntityStats: builder.query({
      query: () => ({
        url: `/revenue/application/entity-stats`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useFetchApplicationsForHeadQuery,
  useFetchSingleApplicationQuery,
  useFetchApplicationsQuery,
  useUpdateApplicationSectionMutation,
  useUploadApplicationDocumentMutation,
  useRemoveApplicationDocumentMutation,
  useUpdateChemicalRiskFlakMutation,
  useTransferApplicationMutation,
  useUpdateScaleAndLocationMutation,

  //movement docs
  useFetchAllMovementDocumentsQuery,

  //efficacy trials
  useFetchAllEfficacyTrialsQuery,
  useFetchSingleEfficacyTrialQuery,
  useUpdateEfficacyTrialMutation,

  useFetchApplicationEntityStatsQuery,
} = applicationApi;
