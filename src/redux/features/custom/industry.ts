import { revenueSlice } from "../api/revenueSlice";

export const industryApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    createIndustry: builder.mutation({
      query: (payload) => ({
        url: `/industry/create`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    updateIndustry: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/industry/update/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
    }),

    fetchIndustries: builder.query({
      query: ({ page, limit, searchTerm, sortOrder, sortField }) => ({
        url: `/industry/all?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useFetchIndustriesQuery,
} = industryApi;
