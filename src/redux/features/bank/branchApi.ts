import { apiSlice } from "../api/apiSlice";

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    branchList: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
        bankId?: string;
      }
    >({
      query: ({ page, limit, searchTerm, sortField, sortOrder, bankId }) => ({
        url: `/bankbranches/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&bank_id=${bankId || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    branchListByBankId: builder.query({
      query: ({ id }) => ({
        url: `/bankbranches/fetch_list/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    branchFullList: builder.query({
      query: () => ({
        url: `/bankbranches/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    branchStore: builder.mutation({
      query: ({ name, bank_id, code }) => ({
        url: "/bankbranches/store",
        method: "POST",
        body: { name, bank_id, code },
        credentials: "include",
      }),
    }),
    branchUpdate: builder.mutation<
      any,
      { idToEdit: string; name: string; bank_id: string; code: string }
    >({
      query: ({ idToEdit, name, bank_id, code }) => ({
        url: `/bankbranches/update/`,
        method: "PATCH",
        body: { _id: idToEdit, name, bank_id, code },
        credentials: "include",
      }),
    }),
    branchDelete: builder.mutation({
      query: (id) => ({
        url: `/bankbranches/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    loadBranchesData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/bankbranches/load_data",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
  }),
});

export const {
  useBranchListQuery,
  useBranchFullListQuery,
  useBranchStoreMutation,
  useBranchUpdateMutation,
  useBranchDeleteMutation,
  useBranchListByBankIdQuery,
  useLoadBranchesDataMutation,
} = branchApi;
