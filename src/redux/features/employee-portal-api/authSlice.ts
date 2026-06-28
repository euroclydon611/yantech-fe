import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type EmployeeAuthState = {
  token: string;
  employee: any;
  message: string;
  csrfToken: string;
};

const initialState: EmployeeAuthState = {
  token: "",
  employee: null,
  message: "",
  csrfToken: "",
};

const employeeAuthSlice = createSlice({
  name: "employee_auth",
  initialState,
  reducers: {
    employeeRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    employeeLogin: (
      state,
      action: PayloadAction<{
        token: string;
        employee: any;
        message: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.employee = action.payload.employee;
      state.message = action.payload.message;
    },
    employeeLogout: (state) => {
      state.token = "";
      state.employee = null;
    },
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
  },
});

export const {
  employeeRegistration,
  employeeLogin,
  employeeLogout,
  setCsrfToken,
} = employeeAuthSlice.actions;

export default employeeAuthSlice.reducer;
