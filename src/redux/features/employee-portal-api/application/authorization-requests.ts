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
        status,
        startDate,
        endDate,
      }) => ({
        url: `/revenue/application/permit-applications?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchSingleApplication: builder.query({
      query: ({ id }) => ({
        url: `/revenue/application/permit-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
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
        url: `/revenue/application/permit-applications/${payload.id}/update-section`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
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
      query: (formData) => {
        return {
          url: `/revenue/application/permit-applications/upload-document`,
          method: "PATCH",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useFetchApplicationsForHeadQuery,
  useFetchSingleApplicationQuery,
  useFetchApplicationsQuery,
  useUpdateApplicationSectionMutation,
  useUploadApplicationDocumentMutation,
  useUpdateChemicalRiskFlakMutation,
} = applicationApi;
