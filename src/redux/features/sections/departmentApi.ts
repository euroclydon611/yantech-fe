import { apiSlice } from "../api/apiSlice";

export const departmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeListByDepartment: builder.query<
      any,
      {
        departmentId: any;
        searchTerm: string;
      }
    >({
      query: ({ searchTerm, departmentId }) => ({
        url: `/departments/employees?searchQuery=${searchTerm}&department_id=${departmentId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    departmentList: builder.query<
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
        url: `/departments/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    departmentFullList: builder.query({
      query: () => ({
        url: `/departments/full_list`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    departmentStore: builder.mutation({
      query: ({ name }) => ({
        url: "/departments/store",
        method: "POST",
        body: { name },
        credentials: "include" as const,
      }),
    }),
    departmentUpdate: builder.mutation<any, { idToEdit: string; name: string }>(
      {
        query: ({ idToEdit, name }) => ({
          url: `/departments/update/`,
          method: "PATCH",
          body: { _id: idToEdit, name },
          credentials: "include" as const,
        }),
      }
    ),
    appointHead: builder.mutation<
      any,
      { idToEdit: string; new_head_id: string }
    >({
      query: ({ idToEdit, new_head_id }) => ({
        url: `/departments/select_head`,
        method: "PATCH",
        body: { _id: idToEdit, new_head_id },
        credentials: "include" as const,
      }),
    }),
    departmentDelete: builder.mutation({
      query: (id) => ({
        url: `/departments/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useEmployeeListByDepartmentQuery,
  useDepartmentListQuery,
  useDepartmentFullListQuery,
  useDepartmentStoreMutation,
  useDepartmentUpdateMutation,
  useAppointHeadMutation,
  useDepartmentDeleteMutation,
} = departmentApi;
