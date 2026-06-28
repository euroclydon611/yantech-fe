import { revenueSlice } from "../api/revenueSlice";

export const permitGeoApi = revenueSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermitsWithCoordinates: builder.query<any[], void>({
      query: () => ({ url: "permit/all-with-coordinates", method: "GET", credentials: "include" }),
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const { useGetPermitsWithCoordinatesQuery } = permitGeoApi;
