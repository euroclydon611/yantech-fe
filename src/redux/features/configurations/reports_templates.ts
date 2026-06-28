import { apiSlice } from "../api/apiSlice";

export const serviceCodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReportTemplate: builder.mutation({
      query: (body) => ({
        url: "/requested-reports/store",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    listReportTemplates: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortField,
        sortOrder,
      }) => ({
        url: `/requested-reports/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    fullListReportsTemplates: builder.query({
      query: () => ({
        url: "/requested-reports/full_list",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    updateReportTemplate: builder.mutation({
      query: (body) => ({
        url: "/requested-reports/update",
        method: "PATCH",
        body,
        credentials: "include" as const,
      }),
    }),

    deleteReportTemplate: builder.mutation({
      query: (id) => ({
        url: `/requested-reports/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateReportTemplateMutation,
  useListReportTemplatesQuery,
  useFullListReportsTemplatesQuery,
  useUpdateReportTemplateMutation,
  useDeleteReportTemplateMutation,
} = serviceCodesApi;
