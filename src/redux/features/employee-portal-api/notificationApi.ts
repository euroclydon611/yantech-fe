import { employee_portalSlice } from "../api/employee-portalSlice";

export const notificationApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeNotificationList: builder.query<any, {}>({
      query: () => ({
        url: `/notifications/all`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    readEmployeeNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        credentials: "include" as const,
      }),
    }),

    employeeNotificationStream: builder.query<any, {}>({
      query: () => ({
        url: `/notifications/stream`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useEmployeeNotificationListQuery,
  useReadEmployeeNotificationMutation,
  useEmployeeNotificationStreamQuery
} = notificationApi;
