import { apiSlice } from "../api/apiSlice";

export const unitApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    unitList: builder.query<
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
        url: `/units/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    unitFullList: builder.query({
      query: () => ({
        url: `/units/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    unitStore: builder.mutation({
      query: ({ name, department_id }) => ({
        url: "/units/store",
        method: "POST",
        body: { name, department_id },
        credentials: "include",
      }),
    }),
    unitUpdate: builder.mutation<
      any,
      { idToEdit: string; name: string; department_id: string }
    >({
      query: ({ idToEdit, name, department_id }) => ({
        url: `/units/update/`,
        method: "PATCH",
        body: { _id: idToEdit, name, department_id },
        credentials: "include",
      }),
    }),
    unitDelete: builder.mutation({
      query: (id) => ({
        url: `/units/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUnitListQuery,
  useUnitFullListQuery,
  useUnitStoreMutation,
  useUnitUpdateMutation,
  useUnitDeleteMutation,
} = unitApi;
