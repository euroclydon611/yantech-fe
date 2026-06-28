import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    notificationList: builder.query<any, {}>({
      query: () => ({
        url: `/users/fetch_notifications`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    readNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/users/read_notification/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    markAllAsRead: builder.mutation({
      query: ({ id }) => ({
        url: `/users/read_all_notifications`,
        method: "POST",
        credentials: "include" as const,
      }),
    }),

    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/users/delete_notification/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useNotificationListQuery,
  useReadNotificationMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
