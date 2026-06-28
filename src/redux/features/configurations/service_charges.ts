import { apiSlice } from "../api/apiSlice";

export const serviceChargesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceCharge: builder.mutation({
      query: (body) => ({
        url: "/service-charges/store",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["ServiceCharges"] as any,
    }),

    listServiceCharges: builder.query({
      query: (body) => ({
        url: `/service-charges/list`,
        method: "POST",
        body,
        credentials: "include" as const,
      }),
      providesTags: ["ServiceCharges"] as any,
    }),

    fullListServiceCharges: builder.query({
      query: () => ({
        url: "/service-charges/full_list",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ServiceCharges"] as any,
    }),

    updateServiceCharge: builder.mutation({
      query: (body) => ({
        url: "/service-charges/update",
        method: "PATCH",
        body,
        credentials: "include" as const,
      }),
      invalidatesTags: ["ServiceCharges"] as any,
    }),

    deleteServiceCharge: builder.mutation({
      query: (id) => ({
        url: `/service-charges/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["ServiceCharges"] as any,
    }),
  }),
});

export const {
  useCreateServiceChargeMutation,
  useListServiceChargesQuery,
  useFullListServiceChargesQuery,
  useUpdateServiceChargeMutation,
  useDeleteServiceChargeMutation,
} = serviceChargesApi;
