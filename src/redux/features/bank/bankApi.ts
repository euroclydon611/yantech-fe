import { apiSlice } from "../api/apiSlice";

export const bankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bankList: builder.query<
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
        url: `/banks/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    bankFullList: builder.query({
      query: () => ({
        url: `/banks/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    bankStore: builder.mutation({
      query: ({ name, code }) => ({
        url: "/banks/store",
        method: "POST",
        body: { name, code },
        credentials: "include",
      }),
    }),
    bankUpdate: builder.mutation<any, { idToEdit: string; name: string; code: string }>({
      query: ({ idToEdit, name, code }) => ({
        url: `/banks/update/`,
        method: "PATCH",
        body: { _id: idToEdit, name, code },
        credentials: "include",
      }),
    }),
    bankDelete: builder.mutation({
      query: (id) => ({
        url: `/banks/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    loadBanksData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/banks/load_data",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useBankListQuery,
  useBankFullListQuery,
  useBankStoreMutation,
  useBankUpdateMutation,
  useBankDeleteMutation,
  useLoadBanksDataMutation,
} = bankApi;
