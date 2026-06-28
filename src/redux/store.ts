"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import { employee_portalSlice } from "./features/api/employee-portalSlice";
import employeeAuthSlice from "./features/employee-portal-api/authSlice";
import { revenueSlice } from "./features/api/revenueSlice";


const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [revenueSlice.reducerPath]: revenueSlice.reducer,

    
    [employee_portalSlice.reducerPath]: employee_portalSlice.reducer,
    auth: authSlice,
    employee_auth: employeeAuthSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(revenueSlice.middleware)
      .concat(employee_portalSlice.middleware),
});

//when the application refreshes, call the refreshToken
const initializeApp = async () => {
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );

  await store.dispatch(
    employee_portalSlice.endpoints.loadEmployee.initiate(
      {},
      { forceRefetch: true }
    )
  );
};

initializeApp();

export type RootState = ReturnType<typeof store.getState>;

export default store;
