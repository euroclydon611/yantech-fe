import { employee_portalSlice } from "../api/employee-portalSlice";
employee_portalSlice;
import { employeeLogin, employeeLogout } from "./authSlice";

type LoginResponse = {
  data: any;
  token: string;
  privileges: any;
  message: string;
};

export const authApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    attendanceInfo: builder.query({
      query: ({ year, month }) => ({
        url: `/info/view_attendance?month=${month}&year=${year}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    employeeInfoUpdate: builder.mutation({
      query: (values) => ({
        url: "/info/update_data",
        method: "PATCH",
        body: { ...values },
        credentials: "include" as const,
      }),
    }),

    employeeRequestOTP: builder.mutation({
      query: ({ staff_id }) => ({
        url: "/auth/request_otp",
        method: "POST",
        body: { staff_id },
        credentials: "include" as const,
      }),
    }),
    employeeVerifyOTP: builder.mutation({
      query: ({ staff_id, otp }) => ({
        url: "/auth/verify_otp",
        method: "POST",
        body: { staff_id, otp },
        credentials: "include" as const,
      }),
    }),
    employeeSetPassword: builder.mutation({
      query: ({ staff_id, password }) => ({
        url: "/auth/set_password",
        method: "POST",
        body: { staff_id, password },
        credentials: "include" as const,
      }),
    }),

    employeeLogin: builder.mutation<LoginResponse, any>({
      query: ({ staff_id, password }) => ({
        url: "auth/login",
        method: "POST",
        body: { staff_id, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const results = await queryFulfilled;
          dispatch(
            employeeLogin({
              token: results.data.token,
              employee: results.data.data,
              message: results.data.message,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    employeeLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(employeeLogout());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    //change password
    EmployeeChangePassword: builder.mutation({
      query: ({ old_password, new_password }) => ({
        url: "/auth/change_password",
        method: "PATCH",
        body: { old_password, new_password },
        credentials: "include" as const,
      }),
    }),

    employeeRequestOTPReset: builder.mutation({
      query: ({ staff_id }) => ({
        url: "/auth/request_reset_otp",
        method: "PATCH",
        body: { staff_id },
        credentials: "include" as const,
      }),
    }),
    employeeVerifyOTPReset: builder.mutation({
      query: ({ staff_id, otp, new_password }) => ({
        url: "/auth/verify_password_reset",
        method: "POST",
        body: { staff_id, otp, new_password },
        credentials: "include" as const,
      }),
    }),

    getCsrfToken: builder.query({
      query: () => ({
        url: `/auth/csrf-token`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useEmployeeInfoUpdateMutation,
  useEmployeeRequestOTPMutation,
  useEmployeeVerifyOTPMutation,
  useEmployeeSetPasswordMutation,
  useEmployeeLoginMutation,
  useEmployeeLogoutMutation,
  useEmployeeRequestOTPResetMutation,
  useEmployeeVerifyOTPResetMutation,
  useEmployeeChangePasswordMutation,

  useGetCsrfTokenQuery,

  //
  useAttendanceInfoQuery,
} = authApi;
