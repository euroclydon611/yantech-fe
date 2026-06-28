import { revenueSlice } from "../api/revenueSlice";

export const customApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAssessmentType: builder.mutation({
      query: (payload) => ({
        url: `/assessment-type/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateAssessmentType: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/assessment-type/update/?id=${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchAssessmentTypes: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/assessment-type/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createAssessmentRegister: builder.mutation({
      query: (payload) => ({
        url: `/assessment-register/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateAssessmentRegister: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/assessment-register/update/?id=${id}`,
        method: "PUT",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchAssessmentRegister: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField, type }) => ({
        url: `/assessment-register/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&type=${type}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createAssessmentClass: builder.mutation({
      query: (payload) => ({
        url: `/assessment-config/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateAssessmentClass: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/assessment-config/update/?id=${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchAssessmentClasses: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/assessment-config/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createHsCodeChargeAssessment: builder.mutation({
      query: (payload) => ({
        url: `/assessment-charge-register/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateHsCodeChargeAssessment: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/assessment-charge-register/update/${id}`,
        method: "PUT",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchHsCodeChargesAsessement: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/assessment-charge-register/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchConsigneeAssessmentReport: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/consignee/assessment-reports?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchSingleConsigneeAssessmentReport: builder.query({
      query: ({ reportId }) => ({
        url: `/consignee/assessment-report?id=${reportId}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    regenerateConsigneeAssessmentReport: builder.mutation({
      query: () => ({
        url: `/consignee/refresh-assessment-report`,
        method: "POST",
        // body: payload,
        credentials: "include",
      }),
    }),

    fetchConsigneeAssesementTransactions: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        reportId,
        showNonInvoiced,
      }) => ({
        url: `/consignee/assessment-report-details?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&id=${reportId}&showNonInvoiced=${showNonInvoiced}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateAssessmentClassMutation,
  useUpdateAssessmentClassMutation,
  useFetchAssessmentClassesQuery,
  useCreateHsCodeChargeAssessmentMutation,
  useUpdateHsCodeChargeAssessmentMutation,
  useFetchHsCodeChargesAsessementQuery,

  useRegenerateConsigneeAssessmentReportMutation,
  useFetchConsigneeAssessmentReportQuery,
  useFetchConsigneeAssesementTransactionsQuery,
  useFetchSingleConsigneeAssessmentReportQuery,

  //types
  useCreateAssessmentTypeMutation,
  useUpdateAssessmentTypeMutation,
  useFetchAssessmentTypesQuery,

  //register
  useCreateAssessmentRegisterMutation,
  useUpdateAssessmentRegisterMutation,
  useFetchAssessmentRegisterQuery,
} = customApi;
