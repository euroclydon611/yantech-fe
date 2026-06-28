import { apiSlice } from "./api/apiSlice";

export const appApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    backupFileName: builder.query({
      query: () => ({
        url: `/admins/file-name`,
        method: "GET",
        credentials: "include",
      }),
    }),
    restoreBackup: builder.mutation({
      query: (formData) => ({
        url: "/admins/restore",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    uploadPayrollPdf: builder.mutation({
      query: (formData) => ({
        url: "/pdf-payroll-reader/read-pdf",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRestoreBackupMutation,
  useBackupFileNameQuery,
  useUploadPayrollPdfMutation,
} = appApi;
