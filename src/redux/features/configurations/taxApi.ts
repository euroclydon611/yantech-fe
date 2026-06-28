import { apiSlice } from "../api/apiSlice";

export const taxApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    taxList: builder.query({
      query: () => ({
        url: `/configs/tax/find`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    taxUpdate: builder.mutation({
      query: ({ tax }) => ({
        url: "/configs/tax/update",
        method: "PATCH",
        body: { tax },
        credentials: "include",
      }),
    }),

    casualWorkerTaxList: builder.query({
      query: () => ({
        url: `/configs/casual-worker-tax`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    casualWorkerUpdate: builder.mutation({
      query: ({ casual_worker_tax }) => ({
        url: "/configs/casual-worker-tax/update",
        method: "PATCH",
        body: { casual_worker_tax },
        credentials: "include",
      }),
    }),

    overtimeTaxRateList: builder.query({
      query: () => ({
        url: `/configs/overtime-tax-rates`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    overtimeTaxRateUpdate: builder.mutation({
      query: ({ overtime_tax_rates }) => ({
        url: "/configs/overtime-tax-rates",
        method: "PATCH",
        body: { overtime_tax_rates },
        credentials: "include",
      }),
    }),

    bonusTaxRateList: builder.query({
      query: () => ({
        url: `/configs/bonus-tax-rates`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    bonusTaxRateUpdate: builder.mutation({
      query: ({ bonus_tax_rates }) => ({
        url: "/configs/bonus-tax-rates",
        method: "PATCH",
        body: { bonus_tax_rates },
        credentials: "include",
      }),
    }),

    taxReliefList: builder.query({
      query: () => ({
        url: `/configs/tax_exemptions`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    taxReliefUpdate: builder.mutation({
      query: ({ tax_exemptions }) => ({
        url: "/configs/tax_exemptions",
        method: "PATCH",
        body: { tax_exemptions },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useTaxListQuery,
  useTaxUpdateMutation,
  useCasualWorkerTaxListQuery,
  useCasualWorkerUpdateMutation,

  useOvertimeTaxRateListQuery,
  useOvertimeTaxRateUpdateMutation,
  useBonusTaxRateListQuery,
  useBonusTaxRateUpdateMutation,

  useTaxReliefListQuery,
  useTaxReliefUpdateMutation,
} = taxApi;
