import { employee_portalSlice } from "../api/employee-portalSlice";

export const entityApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    entityReportees: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm?: string;
        sortOrder?: string;
        sortField?: string;
        entity_id?: string;
      }
    >({
      query: ({
        page,
        limit,
        searchTerm = "",
        sortField = "",
        sortOrder = "asc",
        entity_id,
      }) => ({
        url: `/entity/reportees?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&entity_id=${entity_id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    entityStaffs: builder.query({
      query: ({
        page,
        limit,
        searchTerm = "",
        sortField = "",
        sortOrder = "asc",
        entity_id,
      }) => ({
        url: `/entity/staff?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&entity_id=${entity_id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    entitySubordinateStaffs: builder.query({
      query: ({
        page,
        limit,
        searchTerm = "",
        sortField = "",
        sortOrder = "asc",
        entity_id,
      }) => ({
        url: `/entity/subordinate-staff?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&entity_id=${entity_id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["SubordinateStaff"],
    }),

    entityStaffStatusChange: builder.mutation({
      query: ({ staff_id, status }) => ({
        url: "/entity/change-staff-status",
        method: "POST",
        body: { staff_id, status },
        credentials: "include" as const,
      }),
      invalidatesTags: ["SubordinateStaff"],
    }),

    entityStaffPermissionChange: builder.mutation({
      query: ({ staff_id, permissions }) => ({
        url: "/entity/grant-staff-permissions",
        method: "POST",
        body: { staff_id, permissions },
        credentials: "include" as const,
      }),
      invalidatesTags: ["SubordinateStaff"],
    }),

    entityPayrollSnapShots: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        pay_month,
        year,
        entity_id,
        verification_status,
      }) => ({
        url: `/entity/payroll-snapshots?page=${page}&limit=${limit}&searchQuery=${searchTerm}&pay_month=${pay_month}&year=${year}&entity_id=${entity_id}&verification_status=${verification_status || ""}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    verifySnapshotEmployee: builder.mutation<
      any,
      {
        snapshotId: string;
        status: string;
        notes?: string;
      }
    >({
      query: (data) => ({
        url: "/entity/snapshots/verify-employee",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),
    bulkVerifySnapshotEmployees: builder.mutation<
      any,
      {
        snapshotIds: string[];
        status: string;
        notes?: string;
      }
    >({
      query: (data) => ({
        url: "/entity/snapshots/bulk-verify-employees",
        method: "PATCH",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getSnapshotVerificationSummaryByEntity: builder.query<
      any,
      {
        pay_month: string;
        year: number;
        entity_id: string;
      }
    >({
      query: ({ pay_month, year, entity_id }) => ({
        url: `/entity/snapshots/verification-summary?pay_month=${pay_month}&year=${year}&entity_id=${entity_id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useEntityReporteesQuery,
  useEntityStaffsQuery,
  useEntitySubordinateStaffsQuery,
  useEntityStaffStatusChangeMutation,
  useEntityStaffPermissionChangeMutation,
  useEntityPayrollSnapShotsQuery,
  useVerifySnapshotEmployeeMutation,
  useBulkVerifySnapshotEmployeesMutation,
  useGetSnapshotVerificationSummaryByEntityQuery,
} = entityApi;
