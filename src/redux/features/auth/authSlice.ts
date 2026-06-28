import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  password: string;
  role: "";
  isVerified: boolean;
  courses: { _id: string }[];
};

type AuthState = {
  token: string;
  user: User | null;
  privileges: string[] | null;
  message: string;
  csrfToken: string;
};

const initialState: AuthState = {
  token: "",
  user: null,
  privileges: null,
  message: "",
  csrfToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },

    userLogin: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
        privileges: string[];
        message: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.privileges = action.payload.privileges;
      state.message = action.payload.message;
    },
    userLogout: (state) => {
      state.token = "";
      state.user = null;
      state.privileges = null;
      state.csrfToken = "";
    },
    setCsrfToken: (state, action: PayloadAction<string>) => {
      state.csrfToken = action.payload;
    },
  },
});

export const { userRegistration, userLogin, userLogout, setCsrfToken } = authSlice.actions;

export default authSlice.reducer;
