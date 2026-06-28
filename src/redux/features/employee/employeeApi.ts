import { apiSlice } from "../api/apiSlice";

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeList: builder.query<
      any,
      {
        page: number;
        limit: any;
        searchTerm: string;
        sortOrder: string;
        sortField: string;
        status?: string;
        consultant?: string;
        subcontractor?: string;
        wage_type?: string;
        grade_id?: string;
        bank_id?: string;
        bank_branch_id?: string;
        notch?: string;
        gender?: string;
        entity_id?: string;
        is_auto_notch_update?: string;
        is_payroll_eligible?: string;
        gra_employment_type?: string;
        gra_position?: string;
        isActivated?: string;
        isOnline?: string;
        assumption_date_from?: string;
        assumption_date_to?: string;
        dob_from?: string;
        dob_to?: string;
      }
    >({
      query: ({
        page,
        limit,
        searchTerm,
        sortField,
        sortOrder,
        status,
        consultant,
        subcontractor,
        wage_type,
        grade_id,
        bank_id,
        bank_branch_id,
        notch,
        gender,
        entity_id,
        is_auto_notch_update,
        is_payroll_eligible,
        gra_employment_type,
        gra_position,
        isActivated,
        isOnline,
        assumption_date_from,
        assumption_date_to,
        dob_from,
        dob_to,
      }) => ({
        url: `/employees/list?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}&status=${status || ""}&consultant=${consultant || ""}&subcontractor=${subcontractor || ""}&wage_type=${wage_type || ""}&grade_id=${grade_id || ""}&bank_id=${bank_id || ""}&bank_branch_id=${bank_branch_id || ""}&notch=${notch || ""}&gender=${gender || ""}&entity_id=${entity_id || ""}&is_auto_notch_update=${is_auto_notch_update || ""}&is_payroll_eligible=${is_payroll_eligible || ""}&gra_employment_type=${gra_employment_type || ""}&gra_position=${gra_position || ""}&isActivated=${isActivated || ""}&isOnline=${isOnline || ""}&assumption_date_from=${assumption_date_from || ""}&assumption_date_to=${assumption_date_to || ""}&dob_from=${dob_from || ""}&dob_to=${dob_to || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    employeeFullList: builder.query<
      any,
      {
        gender?: string;
        grade_id?: string;
        gra_employment_type?: string;
        gra_position?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.gender) queryParams.append("gender", params.gender);
        if (params?.grade_id) queryParams.append("grade_id", params.grade_id);
        if (params?.gra_employment_type)
          queryParams.append("gra_employment_type", params.gra_employment_type);
        if (params?.gra_position)
          queryParams.append("gra_position", params.gra_position);

        return {
          url: `/employees/fetch-all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
          method: "GET",
          credentials: "include" as const,
        };
      },
    }),
    getEmployeeById: builder.query({
      query: ({ employeeId }) => ({
        url: `/employees/get_data/${employeeId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getEmployeeFinancialDetails: builder.query({
      query: ({ employeeId }) => ({
        url: `/employees/full-info/${employeeId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    employeeStore: builder.mutation({
      query: ({
        staff_id,
        lastname,
        firstname,
        other_names,
        date_of_birth,
        gender,
        passport_image,
        phone_number_1,
        email,
        personal_email,
        ghana_card_number,
        tin_number,
        ssnit_number,
        ssnit_tier2_number,
        ssnit_tier3_number,
        bank_id,
        bank_branch_id,
        bank_account_number,
        bank_account_name,
        nok_name,
        nok_relationship,
        nok_phone_number,
        nok_email,
        emergency_contact_name,
        emergency_contact_number,
        emergency_contact_relationship,
        dependants,
        country,
        grade_id,
        notch,
        grade_incremental_ids,
        department_id,
        unit_id,
        hire_start_date,
        hire_end_date,
        assumption_date,
        appointment_letter,
        address,
        house_number,
        ghana_post,
        personnal_pme_ids,
        status,
        wage_type,
        is_head,
        subcontractor,
        consultant,
        is_tax_payer,
        is_ssnit_payer,
        is_auto_notch_update,
        is_auto_status_update,
        is_payroll_eligible,
        exemptions,

        //added
        entity_id,
        gra_resident,
        gra_employment_type,
        gra_position,
        staff_skill,
        staff_community,
        resident_town,
        marital_status,
        hometown,
        allowable_leave_days,
        effective_date_of_last_promotion,
        rank_title,
        //other
        academic_qualifications,
        professional_qualifications,
        trainings,
        special_skills,
        signature,
      }) => {
        console.log("STORE MUTATION PAYROLL ELIGIBLE:", is_payroll_eligible);
        const formData = new FormData();

        formData.append("staff_id", staff_id);
        formData.append("lastname", lastname);
        formData.append("firstname", firstname);
        formData.append("other_names", other_names);
        formData.append("date_of_birth", date_of_birth);
        formData.append("gender", gender);
        formData.append("passport_image", passport_image);
        formData.append("signature", signature);
        formData.append("phone_number_1", phone_number_1);
        formData.append("email", email);
        formData.append("personal_email", personal_email);
        formData.append("ghana_card_number", ghana_card_number);
        formData.append("tin_number", tin_number);
        formData.append("ssnit_number", ssnit_number);
        formData.append("ssnit_tier2_number", ssnit_tier2_number);
        formData.append("ssnit_tier3_number", ssnit_tier3_number);
        formData.append("bank_id", bank_id);
        formData.append("bank_branch_id", bank_branch_id);
        formData.append("bank_account_number", bank_account_number);
        formData.append("bank_account_name", bank_account_name);
        formData.append("nok_name", nok_name);
        formData.append("nok_relationship", nok_relationship);
        formData.append("nok_phone_number", nok_phone_number);
        formData.append("nok_email", nok_email);
        formData.append("emergency_contact_name", emergency_contact_name);
        formData.append("emergency_contact_number", emergency_contact_number);
        formData.append(
          "emergency_contact_relationship",
          emergency_contact_relationship
        );
        formData.append("dependants", JSON.stringify(dependants));
        formData.append("country", country);
        formData.append("grade_id", grade_id);
        formData.append("notch", notch || "");
        formData.append(
          "grade_incremental_ids",
          JSON.stringify(grade_incremental_ids)
        );
        formData.append("department_id", department_id);
        formData.append("unit_id", unit_id);
        formData.append("hire_start_date", hire_start_date);
        formData.append("hire_end_date", hire_end_date);
        formData.append("assumption_date", assumption_date);
        formData.append("appointment_letter", appointment_letter);
        formData.append("address", address);
        formData.append("house_number", house_number);
        formData.append("ghana_post", ghana_post);
        formData.append("personnal_pme_ids", JSON.stringify(personnal_pme_ids));
        formData.append("status", status);
        formData.append("wage_type", wage_type);
        formData.append("is_head", is_head);
        formData.append("subcontractor", subcontractor);
        formData.append("consultant", consultant);
        formData.append("is_tax_payer", is_tax_payer);
        formData.append("is_ssnit_payer", is_ssnit_payer);
        formData.append("is_auto_notch_update", is_auto_notch_update);
        formData.append("is_auto_status_update", is_auto_status_update);
        formData.append("is_payroll_eligible", is_payroll_eligible);
        formData.append("exemptions", JSON.stringify(exemptions));

        //added
        formData.append("entity_id", entity_id);
        formData.append("gra_resident", gra_resident);
        formData.append("gra_employment_type", gra_employment_type);
        formData.append("gra_position", gra_position);
        formData.append("staff_skill", staff_skill);
        formData.append("staff_community", staff_community);
        formData.append("resident_town", resident_town);
        formData.append("marital_status", marital_status);
        formData.append("hometown", hometown);
        formData.append("allowable_leave_days", allowable_leave_days);
        formData.append(
          "effective_date_of_last_promotion",
          effective_date_of_last_promotion
        );
        formData.append("rank_title", rank_title);

        //other
        formData.append(
          "academic_qualifications",
          JSON.stringify(academic_qualifications)
        );
        formData.append(
          "professional_qualifications",
          JSON.stringify(professional_qualifications)
        );

        formData.append("trainings", JSON.stringify(trainings));
        formData.append("special_skills", JSON.stringify(special_skills));

        return {
          url: "/employees/store",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
    loadEmployeeData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/employees/load_data",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),
    bulkUpdateEmployeeData: builder.mutation({
      query: ({ doc }) => {
        const formData = new FormData();

        formData.append("doc", doc);

        return {
          url: "/employees/bulk_update",
          method: "POST",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    employeeUpdate: builder.mutation({
      query: ({
        staff_id,
        lastname,
        firstname,
        other_names,
        date_of_birth,
        gender,
        passport_image,
        phone_number_1,
        email,
        personal_email,
        ghana_card_number,
        tin_number,
        ssnit_number,
        ssnit_tier2_number,
        ssnit_tier3_number,
        bank_id,
        bank_branch_id,
        bank_account_number,
        bank_account_name,
        nok_name,
        nok_relationship,
        nok_phone_number,
        nok_email,
        emergency_contact_name,
        emergency_contact_number,
        emergency_contact_relationship,
        dependants,
        country,
        grade_id,
        notch,
        grade_incremental_ids,
        department_id,
        unit_id,
        hire_start_date,
        hire_end_date,
        assumption_date,
        appointment_letter,
        address,
        house_number,
        ghana_post,
        personnal_pme_ids,
        status,
        wage_type,
        basic_salary,
        hourly_rate,
        is_head,
        subcontractor,
        consultant,
        is_tax_payer,
        is_ssnit_payer,
        is_auto_notch_update,
        is_auto_status_update,
        is_payroll_eligible,
        exemptions,

        //added
        entity_id,
        gra_resident,
        gra_employment_type,
        gra_position,
        staff_skill,
        staff_community,
        resident_town,
        marital_status,
        hometown,
        allowable_leave_days,
        remaining_leave_days,
        effective_date_of_last_promotion,
        rank_title,

        //other
        academic_qualifications,
        professional_qualifications,
        trainings,
        special_skills,
        signature,
      }) => {
        console.log("MUTATION PAYROLL ELIGIBLE:", is_payroll_eligible);
        const formData = new FormData();

        formData.append("staff_id", staff_id);
        formData.append("lastname", lastname);
        formData.append("firstname", firstname);
        formData.append("other_names", other_names);
        formData.append("date_of_birth", date_of_birth);
        formData.append("gender", gender);
        formData.append("passport_image", passport_image);
        formData.append("signature", signature);
        formData.append("phone_number_1", phone_number_1);
        formData.append("email", email);
        formData.append("personal_email", personal_email);
        formData.append("ghana_card_number", ghana_card_number);
        formData.append("tin_number", tin_number);
        formData.append("ssnit_number", ssnit_number);
        formData.append("ssnit_tier2_number", ssnit_tier2_number);
        formData.append("ssnit_tier3_number", ssnit_tier3_number);
        formData.append("bank_id", bank_id);
        formData.append("bank_branch_id", bank_branch_id);
        formData.append("bank_account_number", bank_account_number);
        formData.append("bank_account_name", bank_account_name);
        formData.append("nok_name", nok_name);
        formData.append("nok_relationship", nok_relationship);
        formData.append("nok_phone_number", nok_phone_number);
        formData.append("nok_email", nok_email);
        formData.append("emergency_contact_name", emergency_contact_name);
        formData.append("emergency_contact_number", emergency_contact_number);
        formData.append(
          "emergency_contact_relationship",
          emergency_contact_relationship
        );
        formData.append("dependants", JSON.stringify(dependants));
        formData.append("country", country);
        formData.append("grade_id", grade_id);
        formData.append("notch", notch || "");
        formData.append(
          "grade_incremental_ids",
          JSON.stringify(grade_incremental_ids)
        );
        formData.append("department_id", department_id);
        formData.append("unit_id", unit_id);
        formData.append("hire_start_date", hire_start_date);
        formData.append("hire_end_date", hire_end_date);
        formData.append("assumption_date", assumption_date);
        formData.append("appointment_letter", appointment_letter);
        formData.append("address", address);
        formData.append("house_number", house_number);
        formData.append("ghana_post", ghana_post);
        formData.append("personnal_pme_ids", JSON.stringify(personnal_pme_ids));
        formData.append("status", status);
        formData.append("wage_type", wage_type);
        formData.append("hourly_rate", hourly_rate);
        formData.append("basic_salary", basic_salary);
        formData.append("is_head", is_head);
        formData.append("subcontractor", subcontractor);
        formData.append("consultant", consultant);
        formData.append("is_tax_payer", is_tax_payer);
        formData.append("is_ssnit_payer", is_ssnit_payer);
        formData.append("is_auto_notch_update", is_auto_notch_update);
        formData.append("is_auto_status_update", is_auto_status_update);
        formData.append("is_payroll_eligible", is_payroll_eligible);
        formData.append("tax_exemptions", JSON.stringify(exemptions));

        //added
        formData.append("entity_id", entity_id);
        formData.append("gra_resident", gra_resident);
        formData.append("gra_employment_type", gra_employment_type);
        formData.append("gra_position", gra_position);
        formData.append("staff_skill", staff_skill);
        formData.append("staff_community", staff_community);
        formData.append("resident_town", resident_town);
        formData.append("marital_status", marital_status);
        formData.append("hometown", hometown);
        formData.append("allowable_leave_days", allowable_leave_days);
        formData.append("remaining_leave_days", remaining_leave_days);
        formData.append(
          "effective_date_of_last_promotion",
          effective_date_of_last_promotion
        );
        formData.append("rank_title", rank_title);

        //other
        formData.append(
          "academic_qualifications",
          JSON.stringify(academic_qualifications)
        );
        formData.append(
          "professional_qualifications",
          JSON.stringify(professional_qualifications)
        );
        formData.append("trainings", JSON.stringify(trainings));
        formData.append("special_skills", JSON.stringify(special_skills));

        return {
          url: "/employees/update",
          method: "PATCH",
          body: formData,
          credentials: "include" as const,
        };
      },
    }),

    employeeInfoUpdate: builder.mutation({
      query: (values) => ({
        url: "/employees/update",
        method: "PATCH",
        body: { ...values },
        credentials: "include" as const,
      }),
    }),

    employeeImage: builder.query({
      query: ({ id }) => ({
        url: `/employees/get-picture-data/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    employeeDelete: builder.mutation({
      query: (id) => ({
        url: `/employees/delete/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    employeeExpiredTrainings: builder.query({
      query: () => ({
        url: `users/expired_training`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    employeesOnLeave: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
        sortField = "end_date",
        sortOrder = "desc",
      }) => ({
        url: `/users/employees_on_leave?page=${page}&limit=${limit}&searchQuery=${searchTerm}&sortOrder=${sortOrder}&sortField=${sortField}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useEmployeeListQuery,
  useEmployeeFullListQuery,
  useGetEmployeeByIdQuery,
  useGetEmployeeFinancialDetailsQuery,
  useEmployeeStoreMutation,
  useLoadEmployeeDataMutation,
  useBulkUpdateEmployeeDataMutation,
  useEmployeeUpdateMutation,
  useEmployeeDeleteMutation,
  useEmployeeImageQuery,
  useEmployeeInfoUpdateMutation,

  //
  useEmployeeExpiredTrainingsQuery,
  useEmployeesOnLeaveQuery,
} = employeeApi;
