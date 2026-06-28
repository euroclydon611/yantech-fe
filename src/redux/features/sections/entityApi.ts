import { apiSlice } from "../api/apiSlice";

export const entityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeListByEntity: builder.query<
      any,
      {
        entityId: any;
        searchQuery?: string;
      }
    >({
      query: ({ entityId, searchQuery = "" }) => ({
        url: `/entity/employees?entity_id=${entityId}&searchQuery=${searchQuery}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    entityList: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortField,
        sortOrder,
        designation,
      }) => ({
        url: `/entity/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&designation=${designation}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    entityFullList: builder.query({
      query: ({ designation = "" }) => ({
        url: `/entity/full_list?designation=${designation}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    entityStore: builder.mutation({
      query: ({ name, designation, reporting_entity_id, branch_code }) => {
        const body: {
          name: string;
          designation: string;
          reporting_entity_id?: string;
          branch_code?: string;
        } = {
          name,
          designation,
        };

        if (designation === "department" || designation === "division") {
          body.reporting_entity_id = reporting_entity_id;
        } else if (designation === "unit") {
          body.reporting_entity_id = reporting_entity_id;
        }

        if (branch_code) {
          body.branch_code = branch_code;
        }

        return {
          url: "/entity/store",
          method: "POST",
          body,
          credentials: "include",
        };
      },
    }),

    entityUpdate: builder.mutation({
      query: ({
        idToEdit,
        name,
        designation,
        reporting_entity_id,
        branch_code,
        officeLocation,
      }) => {
        const body: {
          _id: string;
          name: string;
          designation: string;
          reporting_entity_id?: string;
          branch_code?: string;
          officeLocation?: string | null;
        } = {
          name,
          designation,
          _id: idToEdit,
        };

        if (designation === "department" || designation === "division") {
          body.reporting_entity_id = reporting_entity_id;
        } else if (designation === "unit") {
          body.reporting_entity_id = reporting_entity_id;
        }

        if (branch_code) {
          body.branch_code = branch_code;
        }

        body.officeLocation = officeLocation || null;

        return {
          url: `/entity/update`,
          method: "PATCH",
          body,
          credentials: "include",
        };
      },
    }),

    loadEntitiesData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/entity/load_data",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    appointEntityHead: builder.mutation<
      any,
      {
        idToEdit: string;
        new_head_id: string;
        head_start_date: string;
        head_end_date: string;
      }
    >({
      query: ({ idToEdit, new_head_id, head_start_date, head_end_date }) => ({
        url: `/entity/select_head`,
        method: "PATCH",
        body: { _id: idToEdit, new_head_id, head_start_date, head_end_date },
        credentials: "include" as const,
      }),
    }),
    entityDelete: builder.mutation({
      query: (id) => ({
        url: `/entity/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useEmployeeListByEntityQuery,
  useEntityListQuery,
  useEntityFullListQuery,
  useEntityStoreMutation,
  useEntityUpdateMutation,
  useLoadEntitiesDataMutation,
  useAppointEntityHeadMutation,
  useEntityDeleteMutation,
} = entityApi;
