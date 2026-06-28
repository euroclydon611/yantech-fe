import { employee_portalSlice } from "../../api/employee-portalSlice";

export const applicationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    importAuthorizationFile: builder.mutation({
      query: ({ file, type }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/authorization/${type}/save`,
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    fetchFREs: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        status,
      }) => ({
        url: `/authorization/fre/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${status}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchPAs: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        permitType,
        status,
      }) => ({
        url: `/authorization/pa/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&permitType=${permitType}&status=${status}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    fetchRegisteredProducts: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        registrationType,
        hazardClass,
        status,
      }) => ({
        url: `/authorization/registered-products/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&registrationType=${registrationType || ""}&hazardClass=${hazardClass || ""}&status=${status || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getSingleRegisteredProduct: builder.query({
      query: (id: string) => ({
        url: `/authorization/registered-products/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createRegisteredProduct: builder.mutation({
      query: (body) => ({
        url: `/authorization/registered-products/`,
        method: "POST",
        credentials: "include",
        body,
      }),
    }),

    updateRegisteredProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/authorization/registered-products/${id}`,
        method: "PUT",
        credentials: "include",
        body,
      }),
    }),

    deleteRegisteredProduct: builder.mutation({
      query: (id: string) => ({
        url: `/authorization/registered-products/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    importRegisteredProductsFile: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/authorization/registered-products/save`,
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useFetchFREsQuery,
  useFetchPAsQuery,
  useImportAuthorizationFileMutation,
  useFetchRegisteredProductsQuery,
  useGetSingleRegisteredProductQuery,
  useCreateRegisteredProductMutation,
  useUpdateRegisteredProductMutation,
  useDeleteRegisteredProductMutation,
  useImportRegisteredProductsFileMutation,
} = applicationApi;
