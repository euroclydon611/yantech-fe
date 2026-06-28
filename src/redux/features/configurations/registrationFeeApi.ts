import { apiSlice } from "../api/apiSlice";

export const registrationFeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationFees: builder.query({
      query: () => ({
        url: "/registration-fees/fetch",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["RegistrationFeeConfig" as any],
    }),

    updateRegistrationFees: builder.mutation({
      query: (payload) => ({
        url: "/registration-fees/update",
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["RegistrationFeeConfig" as any],
    }),
  }),
});

export const {
  useFetchRegistrationFeesQuery,
  useUpdateRegistrationFeesMutation,
} = registrationFeeApi;
