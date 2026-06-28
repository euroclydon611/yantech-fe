import { apiSlice } from "../api/apiSlice";

export const serviceCodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceCode: builder.mutation({
      query: (body) => ({
        url: "/service-codes/store",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    listServiceCodes: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortField,
        sortOrder,
        status = "",
      }) => ({
        url: `/service-codes/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    fullListServiceCodes: builder.query({
      query: () => ({
        url: "/service-codes/full_list",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    updateServiceCode: builder.mutation({
      query: (body) => ({
        url: "/service-codes/update",
        method: "PATCH",
        body,
        credentials: "include" as const,
      }),
    }),

    deleteServiceCode: builder.mutation({
      query: (id) => ({
        url: `/service-codes/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateServiceCodeMutation,
  useListServiceCodesQuery,
  useFullListServiceCodesQuery,
  useUpdateServiceCodeMutation,
  useDeleteServiceCodeMutation,
} = serviceCodesApi;
