import { revenueSlice } from "../api/revenueSlice";

export const customApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    createHsCodeCategory: builder.mutation({
      query: (payload) => ({
        url: `/hscode-category/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateHsCodeCategory: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/hscode-category/update?id=${id}`,
        method: "PUT",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchHsCodeCategories: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/hscode-category/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    createHsCode: builder.mutation({
      query: (payload) => ({
        url: `/hsCodes/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateHsCode: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/hsCodes/update/${id}`,
        method: "PUT",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchHsCodes: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/hsCodes/all-codes?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    loadHsCodes: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("file", doc);

        return {
          url: "/hsCodes/upload-codes",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    deleteHsCode: builder.mutation({
      query: (id) => ({
        url: `/hsCodes/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateHsCodeMutation,
  useUpdateHsCodeMutation,
  useFetchHsCodesQuery,
  useLoadHsCodesMutation,
  useDeleteHsCodeMutation,

  //category
  useCreateHsCodeCategoryMutation,
  useUpdateHsCodeCategoryMutation,
  useFetchHsCodeCategoriesQuery,
} = customApi;
