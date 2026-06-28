import { employee_portalSlice } from "../../api/employee-portalSlice";

export const applicationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBaseFees: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortOrder,
        sortField,
        type = "permit",
      }) => ({
        url: `/revenue/application/${type}-applications/base-fees-config?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    fetchSingleBaseFee: builder.query({
      query: ({ id, type = "permit" }) => ({
        url: `/revenue/application/${type}-applications/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateBaseFee: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/base-fees-config`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    addItemToBaseFee: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/base-fees-config/item`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    removeItemFromBaseFee: builder.mutation({
      query: ({ payload }) => ({
        url: `/revenue/application/${payload.applicationType}-applications/base-fees-config/item`,
        method: "DELETE",
        body: payload,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useFetchBaseFeesQuery,
  useFetchSingleBaseFeeQuery,
  useUpdateBaseFeeMutation,
  useAddItemToBaseFeeMutation,
  useRemoveItemFromBaseFeeMutation,
} = applicationApi;
