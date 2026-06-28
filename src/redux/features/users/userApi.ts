import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userList: builder.query<
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
        url: `/users/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    userFullList: builder.query({
      query: () => ({
        url: `/users/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    userPrivileges: builder.query({
      query: ({ sortField, sortOrder }) => ({
        url: `/users/privileges?sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    userStore: builder.mutation<
      any,
      {
        firstname: string;
        lastname: string;
        other_names?: string;
        email: string;
        phone: string;
        type: string;
        privilege_ids: string[];
      }
    >({
      query: ({
        firstname,
        lastname,
        other_names,
        email,
        phone,
        type,
        privilege_ids,
        // password,
      }) => ({
        url: "/users/store",
        method: "POST",
        body: {
          firstname,
          lastname,
          other_names,
          email,
          type,
          phone,
          // password,
          privilege_ids,
        },
        credentials: "include" as const,
      }),
    }),
    userUpdate: builder.mutation<
      any,
      {
        idToEdit: string;
        firstname: string;
        lastname: string;
        other_names?: string;
        email: string;
        phone: string;
        type: string;
        privilege_ids: string[];
      }
    >({
      query: ({
        idToEdit,
        firstname,
        lastname,
        other_names,
        email,
        phone,
        type,
        privilege_ids,
      }) => ({
        url: `/users/update/`,
        method: "PATCH",
        body: {
          _id: idToEdit,
          firstname,
          lastname,
          other_names,
          email,
          phone,
          type,
          privilege_ids,
        },
        credentials: "include" as const,
      }),
    }),
    userDelete: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    disableUser: builder.mutation({
      query: ({ _id }) => ({
        url: `/users/change-status`,
        method: "PATCH",
        body: { _id },
        credentials: "include" as const,
      }),
    }),

    userRequestOTP: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/request_otp",
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),
    userVerifyOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify_otp",
        method: "POST",
        body: { email, otp },
        credentials: "include" as const,
      }),
    }),
    userSetPassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/set_password",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
    }),

    //=====change password
    userChangePassword: builder.mutation({
      query: ({ old_password, new_password }) => ({
        url: "/auth/change_password",
        method: "PATCH",
        body: { old_password, new_password },
        credentials: "include" as const,
      }),
    }),

    //== request to change password
    userRequestOTPReset: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/request_reset_otp",
        method: "POST",
        body: { email },
        credentials: "include" as const,
      }),
    }),

    userVerifyOTPReset: builder.mutation({
      query: ({ email, otp, new_password }) => ({
        url: "/auth/verify_password_reset",
        method: "POST",
        body: { email, otp, new_password },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useUserListQuery,
  useUserFullListQuery,
  useUserPrivilegesQuery,
  useUserStoreMutation,
  useUserUpdateMutation,
  useUserDeleteMutation,
  useDisableUserMutation,

  ///
  useUserRequestOTPMutation,
  useUserVerifyOTPMutation,
  useUserSetPasswordMutation,
  useUserChangePasswordMutation,

  //request password change
  useUserRequestOTPResetMutation,
  useUserVerifyOTPResetMutation,
} = userApi;
