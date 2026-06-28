import { apiSlice } from "../api/apiSlice";

export const statusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    statusList: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
      }
    >({
      query: ({ page, limit, searchTerm, sortField, sortOrder }) => ({
        url: `/status/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    statusFullList: builder.query({
      query: () => ({
        url: `/status/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    statusStore: builder.mutation({
      query: ({ name }) => ({
        url: "/status/store",
        method: "POST",
        body: { name },
        credentials: "include",
      }),
    }),
    statusUpdate: builder.mutation<any, { idToEdit: string; name: string }>({
      query: ({ idToEdit, name }) => ({
        url: `/status/update/`,
        method: "PATCH",
        body: { _id: idToEdit, name },
        credentials: "include",
      }),
    }),
    statusDelete: builder.mutation({
      query: (id) => ({
        url: `/status/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useStatusListQuery,
  useStatusFullListQuery,
  useStatusStoreMutation,
  useStatusUpdateMutation,
  useStatusDeleteMutation,
} = statusApi;
