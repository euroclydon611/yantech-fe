import { apiSlice } from "../api/apiSlice";

export const entityRoutingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEntityRouting: builder.query({
      query: ({ page, limit, searchTerm, sortField, sortOrder }) => ({
        url: `/entity-routing/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createEntityRouting: builder.mutation({
      query: (data) => ({
        url: `/entity-routing`,
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    updateEntityRouting: builder.mutation({
      query: (body) => ({
        url: `/entity-routing/update`,
        method: "PATCH",
        body: body,
        credentials: "include" as const,
      }),
    }),
    deleteEntityRouting: builder.mutation({
      query: (id) => ({
        url: `/entity-routing/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetEntityRoutingQuery,
  useCreateEntityRoutingMutation,
  useUpdateEntityRoutingMutation,
  useDeleteEntityRoutingMutation,
} = entityRoutingApi;
