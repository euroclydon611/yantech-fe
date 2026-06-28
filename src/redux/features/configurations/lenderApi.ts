import { apiSlice } from "../api/apiSlice";

export const lenderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLenders: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        searchQuery?: string;
        sortField?: string;
        sortOrder?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 25,
        searchQuery = "",
        sortField = "name",
        sortOrder = "asc",
      }) => ({
        url: "/lenders/list",
        method: "POST",
        body: {
          page,
          limit,
          searchQuery,
          sortField,
          sortOrder,
        },
        credentials: "include" as const,
      }),
      providesTags: ["Lender"],
    }),

    getFullLenderList: builder.query<any, any>({
      query: ({}) => ({
        url: "/lenders/full-list",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Lender"],
    }),

    createLender: builder.mutation<any, any>({
      query: (data) => ({
        url: "/lenders",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Lender"],
    }),

    updateLender: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/lenders/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Lender"],
    }),

    deleteLender: builder.mutation<any, string>({
      query: (id) => ({
        url: `/lenders/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Lender"],
    }),
  }),
});

export const {
  useGetLendersQuery,
  useGetFullLenderListQuery,
  useCreateLenderMutation,
  useUpdateLenderMutation,
  useDeleteLenderMutation,
} = lenderApi;
