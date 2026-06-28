import { apiSlice } from "../api/apiSlice";

export const emailServiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    emailPaySlip: builder.mutation<
      any,
      {
        year: any;
        month: any;
        forecast: string;
        is_single: number | string;
        staff_id?: string;
        currency: string
      }
    >({
      query: ({ year, month, forecast, is_single, staff_id, currency }) => ({
        url: `/reports/email-service`,
        method: "POST",
        body: {
          year,
          month,
          forecast,
          is_single,
          staff_id,
          currency
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useEmailPaySlipMutation } = emailServiceApi;
