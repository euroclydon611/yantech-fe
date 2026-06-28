import { employee_portalSlice } from "../api/employee-portalSlice";

export const subdivisionApi = employee_portalSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubDivisions: builder.query<any, void>({
      query: () => ({
        url: "/sub-divisions",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getSubDivision: builder.query<any, string>({
      query: (id) => ({
        url: `/sub-divisions/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    createSubDivision: builder.mutation<any, { name: string; description?: string; headId: string; memberIds?: string[] }>({
      query: (body) => ({
        url: "/sub-divisions",
        method: "POST",
        body,
        credentials: "include" as const,
      }),
    }),

    updateSubDivision: builder.mutation<any, { id: string; name?: string; description?: string }>({
      query: ({ id, ...body }) => ({
        url: `/sub-divisions/${id}`,
        method: "PUT",
        body,
        credentials: "include" as const,
      }),
    }),

    changeSubDivisionHead: builder.mutation<any, { id: string; headId: string }>({
      query: ({ id, headId }) => ({
        url: `/sub-divisions/${id}/head`,
        method: "PATCH",
        body: { headId },
        credentials: "include" as const,
      }),
    }),

    addSubDivisionMembers: builder.mutation<any, { id: string; memberIds: string[] }>({
      query: ({ id, memberIds }) => ({
        url: `/sub-divisions/${id}/members`,
        method: "POST",
        body: { memberIds },
        credentials: "include" as const,
      }),
    }),

    removeSubDivisionMember: builder.mutation<any, { id: string; memberId: string }>({
      query: ({ id, memberId }) => ({
        url: `/sub-divisions/${id}/members/${memberId}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    deleteSubDivision: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sub-divisions/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetSubDivisionsQuery,
  useGetSubDivisionQuery,
  useCreateSubDivisionMutation,
  useUpdateSubDivisionMutation,
  useChangeSubDivisionHeadMutation,
  useAddSubDivisionMembersMutation,
  useRemoveSubDivisionMemberMutation,
  useDeleteSubDivisionMutation,
} = subdivisionApi;
