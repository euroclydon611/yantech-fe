import { useFormik } from "formik";
import * as Yup from "yup";
import { styles } from "../../styles";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { useEffect, useMemo, useState } from "react";
import { useBankFullListQuery } from "../../redux/features/bank/bankApi";
import { useBranchListByBankIdQuery } from "../../redux/features/bank/branchApi";
import { useRankFullListQuery } from "../../redux/features/sections/ranksApi";
import { useStatusFullListQuery } from "../../redux/features/configurations/statusApi";
import { useNavigate } from "react-router-dom";
import {
  useEmployeeListQuery,
  useEmployeeStoreMutation,
} from "../../redux/features/employee/employeeApi";
import Swal from "sweetalert2";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import Select from "react-select";
import { Select as AntdSelect } from "antd";
const { Option } = AntdSelect;
import countryList from "react-select-country-list";
import { IoEyeSharp } from "react-icons/io5";
import { handleDocumentView } from "@/utils/helperFunction";

const schema = Yup.object().shape({
  staff_id: Yup.string().required("Staff ID is required"),
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  gender: Yup.string().required("Please select gender"),
  date_of_birth: Yup.string().required("Date of birth is required"),
  phone_number_1: Yup.string()
    .required("Phone number is required!")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number cannot exceed 15 digits"),

  bank_account_number: Yup.string()
    .matches(/^\d*$/, "Bank account number must contain only digits")
    .nullable(),
  bank_account_name: Yup.string().matches(
    /^[A-Za-z\s]+$/,
    "Bank account name must contain only letters"
  ),
  // ghana_card_number: Yup.string().matches(
  //   /^GHA-\d{9}-\d$/,
  //   "Ghana Card Number must be in the format: GHA-716548672-0"
  // ),
  ghana_card_number: Yup.string().matches(
    /^[A-Z]{3}-\d{9}-\d$/,
    "Ghana Card Number must be in the format: ABC-123456789-0"
  ),
  hire_start_date: Yup.date().nullable().typeError("Invalid date format"),
  assumption_date: Yup.date().nullable().typeError("Invalid date format"),
  hire_end_date: Yup.date()
    .nullable()
    .min(
      Yup.ref("hire_start_date"),
      "Hire end date cannot be earlier than the start date"
    )
    .typeError("Invalid date format"),
  is_payroll_eligible: Yup.boolean().optional(),
  is_auto_notch_update: Yup.boolean().optional(),
  is_auto_status_update: Yup.boolean().optional(),
});

interface CreateEmployeeProps {
  onClose?: () => void;
  refetchList?: () => void;
  isDrawer?: boolean;
}

const CreateEmployee = ({ onClose, refetchList, isDrawer }: CreateEmployeeProps) => {
  if (!isDrawer) PageTitle("Add Employee(s) | HR");
  const options = useMemo(() => countryList().getData(), []);

  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [employeeStore, { data, isSuccess, isLoading, error }] =
    useEmployeeStoreMutation();

  const { refetch } = useEmployeeListQuery({
    page,
    limit,
    searchTerm,
    sortField,
    sortOrder,
  });

  const { data: bankList } = useBankFullListQuery({}, {refetchOnMountOrArgChange: true});
  // const { data: branchList } = useBranchFullListQuery({});
  const { data: entityFullList } = useEntityFullListQuery({}, {refetchOnMountOrArgChange: true});
  const { data: rankList } = useRankFullListQuery({}, {refetchOnMountOrArgChange: true});
  const { data: statusList } = useStatusFullListQuery({}, {refetchOnMountOrArgChange: true});

  const generateRandomStaffID = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const formik = useFormik({
    initialValues: {
      staff_id: "",
      lastname: "",
      firstname: "",
      other_names: "",
      date_of_birth: "",
      gender: "",
      passport_image: null,
      signature: null,
      phone_number_1: "",
      phone_number_2: "",
      phone_number_3: "",
      email: "",
      personal_email: "",
      ghana_card_number: "",
      tin_number: "",
      ssnit_number: "",
      ssnit_tier2_number: "",
      ssnit_tier3_number: "",
      bank_id: "",
      bank_branch_id: "",
      bank_account_number: "",
      bank_account_name: "",
      nok_name: "",
      nok_relationship: "",
      nok_phone_number: "",
      nok_email: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      emergency_contact_relationship: "",
      dependants: [],
      country: "",
      grade_id: "",
      notch: "",
      grade_incremental_ids: [],
      department_id: "",
      unit_id: "",
      hire_start_date: "",
      hire_end_date: "",
      assumption_date: "",
      appointment_letter: "",
      address: "",
      house_number: "",
      ghana_post: "",
      personnal_pme_ids: [],
      status: "",
      wage_type: "",
      is_head: false,
      subcontractor: false,
      consultant: false,
      is_tax_payer: true,
      is_ssnit_payer: true,
      is_auto_notch_update: true,
      is_auto_status_update: true,
      is_payroll_eligible: true,
      rank_title: "",

      //addition fields
      entity_id: "",
      gra_resident: "",
      gra_employment_type: "",
      gra_position: "",
      staff_skill: "",
      staff_community: "",
      resident_town: "",
      marital_status: "",
      allowable_leave_days: "",
      effective_date_of_last_promotion: "",
      hometown: "",
      exemptions: [],

      //others
      // other
      academic_qualifications: [
        { name: "", institution: "", start_date: "", end_date: "" },
      ],

      professional_qualifications: [
        { name: "", institution: "", start_date: "", end_date: "" },
      ],

      trainings: [
        {
          name: "",
          body: "",
          certification: "",
          start_date: "",
          end_date: "",
          expires: false,
        },
      ],
      special_skills: [{ name: "", proficiency_level: "" }],
    },
    validationSchema: schema,
    onSubmit: async () => {
      const { gra_resident } = formik.values;
      const resident_format = gra_resident == "non_resident" ? false : true;
       
      // console.log("Submitting notch:", values.notch);
      await employeeStore({ ...formik.values, gra_resident: resident_format });
    },
  });

  const { errors, touched, values, handleChange, setFieldValue, handleSubmit } =
    formik;

  useEffect(() => {
    if (isChecked) {
      formik.setFieldValue("staff_id", generateRandomStaffID());
    } else {
      formik.setFieldValue("staff_id", "");
    }
  }, [isChecked]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      formik.setFieldValue("staff_id", generateRandomStaffID());
    } else {
      formik.setFieldValue("staff_id", "");
    }
  };

  useEffect(() => {
    if (isDrawer && !open) {
      formik.resetForm();
    }
  }, [isDrawer, open]);

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "The employee has been created.";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          if (isDrawer && onClose) {
            onClose();
            if (refetchList) refetchList();
          } else {
            navigate("/employees");
            refetch();
          }
        }
      });
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  //handle qualification change (academic)
  const handleQualificationChange = (index, e) => {
    const { name, value } = e.target;
    formik.setFieldValue(`academic_qualifications[${index}].${name}`, value);
  };

  const addQualification = () => {
    formik.setFieldValue("academic_qualifications", [
      ...formik.values.academic_qualifications,
      { name: "", institution: "", start_date: "", end_date: "" },
    ]);
  };

  const removeQualification = (index) => {
    const updatedQualifications = formik.values.academic_qualifications.filter(
      (qualification, i) => i !== index
    );
    formik.setFieldValue("academic_qualifications", updatedQualifications);
  };

  //handle qualification change (Professional)
  const handleProfessionalQualificationChange = (index, e) => {
    const { name, value } = e.target;
    formik.setFieldValue(
      `professional_qualifications[${index}].${name}`,
      value
    );
  };

  const addProfessionalQualification = () => {
    formik.setFieldValue("professional_qualifications", [
      ...formik.values.professional_qualifications,
      { name: "", institution: "", start_date: "", end_date: "" },
    ]);
  };

  const removeProfessionalQualification = (index) => {
    const updatedQualifications = formik.values.trainings.filter(
      (qualification, i) => i !== index
    );
    formik.setFieldValue("trainings", updatedQualifications);
  };

  //handle qualification change (Trainings)
  const handleTrainingQualificationChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    // If it's a checkbox, use the `checked` property, otherwise use `value`
    const fieldValue = type === "checkbox" ? checked : value;

    // Update the field value for the checkbox or input
    formik.setFieldValue(`trainings[${index}].${name}`, fieldValue);

    // If 'expires' is unchecked, clear the 'end_date'
    if (name === "expires" && !checked) {
      formik.setFieldValue(`trainings[${index}].end_date`, ""); // Clear end_date when unchecked
    }
  };

  const addTrainingQualification = () => {
    formik.setFieldValue("trainings", [
      ...formik.values.trainings,
      { name: "", institution: "", start_date: "", end_date: "" },
    ]);
  };

  const removeTrainingQualification = (index) => {
    const updatedQualifications = formik.values.trainings.filter(
      (qualification, i) => i !== index
    );
    formik.setFieldValue("trainings", updatedQualifications);
  };

  //handle qualification change (Trainings)
  const handleSkillsQualificationChange = (index, e) => {
    const { name, value } = e.target;
    formik.setFieldValue(`special_skills[${index}].${name}`, value);
  };

  const addSkillsQualification = () => {
    formik.setFieldValue("special_skills", [
      ...formik.values.special_skills,
      { name: "", institution: "", start_date: "", end_date: "" },
    ]);
  };

  const removeSkillsQualification = (index) => {
    const updatedQualifications = formik.values.special_skills.filter(
      (qualification, i) => i !== index
    );
    formik.setFieldValue("special_skills", updatedQualifications);
  };

  const imgUrl =
    values.passport_image instanceof File
      ? URL.createObjectURL(values.passport_image)
      : "/images/user-avatar.png";

  const signatureUrl =
    values.signature instanceof File
      ? URL.createObjectURL(values.signature)
      : "/images/user-avatar.png";

  // console.log(values.bank_id);

  const { data: branchList } = useBranchListByBankIdQuery({
    id: values.bank_id,
  });


  return (
    <div className={isDrawer ? "px-2" : ""}>
      {!isDrawer && (
        <PageLayout
          title="Create Employee"
          subtitle="Add a new staff member to the system"
          breadcrumbs={[{ label: "HR MGT" }, { label: "Employees", href: "/employees" }, { label: "Create" }]}
        />
      )}

      <div className={isDrawer ? "" : "p-4"}>
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto mt-4 bg-white p-4">
            <h1 className="text-[14.4px] font-medium mb-3">PERSONAL INFO</h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-medium text-gray-500">
                    Passport Image
                  </span>
                </div>
                <div className="w-[120px] h-[120px] p-1 border rounded-full overflow-hidden">
                  <img
                    src={`${imgUrl ? imgUrl : "/images/user-avatar.png"}`}
                    alt="Passport"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-medium text-gray-500">
                    Signature
                  </span>
                </div>
                <div className="w-[200px] h-[120px] p-1 border rounded overflow-hidden">
                  <img
                    src={`${
                      signatureUrl ? signatureUrl : "/images/user-avatar.png"
                    }`}
                    alt="Signature"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            <table className="table-auto w-full bg-white">
              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <div>
                        <label htmlFor="name" className={`${styles.label}`}>
                          Staff ID <span className="text-[red]">*</span>
                        </label>
                        <input
                          type="text"
                          id="staff_id"
                          value={values.staff_id}
                          onChange={handleChange}
                          className={`${styles.form_input} ${
                            errors.staff_id &&
                            touched.staff_id &&
                            "border-red-500"
                          }`}
                          placeholder="Enter Staff ID"
                        />
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="mt-1 h-4 w-4"
                      />
                      {errors.staff_id && touched.staff_id && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.staff_id}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="lastname" className={`${styles.label}`}>
                        Last Name <span className="text-[red]">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        value={values.lastname}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.lastname &&
                          touched.lastname &&
                          "border-red-500"
                        }`}
                        placeholder="Enter Last Name"
                      />
                      {errors.lastname && touched.lastname && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.lastname}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="name" className={`${styles.label}`}>
                        First Name <span className="text-[red]">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        value={values.firstname}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.firstname &&
                          touched.firstname &&
                          "border-red-500"
                        }`}
                        placeholder="Enter First Name"
                      />
                      {errors.firstname && touched.firstname && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.firstname}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="other_names"
                        className={`${styles.label}`}
                      >
                        Other Name
                      </label>
                      <input
                        type="text"
                        id="other_names"
                        value={values.other_names}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Other Name"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="name" className={`${styles.label}`}>
                        Date of Birth <span className="text-[red]">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_of_birth"
                        value={values.date_of_birth}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.date_of_birth &&
                          touched.date_of_birth &&
                          "border-red-500"
                        }`}
                        placeholder=""
                      />
                      {errors.date_of_birth && touched.date_of_birth && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.date_of_birth}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="gender" className={`${styles.label}`}>
                        Gender <span className="text-[red]">*</span>
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={values.gender}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.gender && touched.gender && "border-red-500"
                        }`}
                      >
                        <option value="">------</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && touched.gender && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.gender}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="passport_image"
                        className={`${styles.label}`}
                      >
                        Passport Image
                      </label>
                      <input
                        type="file"
                        id="passport_image"
                        onChange={(event: any) => {
                          setFieldValue(
                            "passport_image",
                            event.currentTarget.files[0]
                          );
                        }}
                        accept="image/*"
                        className={`w-full text-[14px] bg-transparent border rounded  text-[#6c757d] px-2 py-[6px] outline-none mt-[4px]`}
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="signature" className={`${styles.label}`}>
                        Signature
                      </label>
                      <input
                        type="file"
                        id="signature"
                        onChange={(event: any) => {
                          setFieldValue(
                            "signature",
                            event.currentTarget.files[0]
                          );
                        }}
                        accept="image/*"
                        className={`w-full text-[14px] bg-transparent border rounded  text-[#6c757d] px-2 py-[6px] outline-none mt-[4px]`}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="phone_number_1"
                        className={`${styles.label}`}
                      >
                        Phone Number <span className="text-[red]">*</span>
                      </label>
                      <input
                        type="text"
                        id="phone_number_1"
                        value={values.phone_number_1}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.phone_number_1 &&
                          touched.phone_number_1 &&
                          "border-red-500"
                        }`}
                        placeholder="Enter Phone Number"
                      />
                      {errors.phone_number_1 && touched.phone_number_1 && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.phone_number_1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="phone_number_2"
                        className={`${styles.label}`}
                      >
                        Other Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone_number_2"
                        value={values.phone_number_2}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Other Phone Number"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="email" className={`${styles.label}`}>
                        Official Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={values.email}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.email && touched.email && "border-red-500"
                        }`}
                        placeholder="Enter Official Email"
                      />
                      {errors.email && touched.email && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="personal_email"
                        className={`${styles.label}`}
                      >
                        Personal Email
                      </label>
                      <input
                        type="email"
                        id="personal_email"
                        value={values.personal_email}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Personal Email"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="ghana_card_number"
                        className={`${styles.label}`}
                      >
                        Ghana Card Number
                      </label>
                      <input
                        type="text"
                        id="ghana_card_number"
                        value={values.ghana_card_number}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.ghana_card_number &&
                          touched.ghana_card_number &&
                          "border-red-500"
                        }`}
                        placeholder="Ex: GHA-716548672-0"
                      />
                      {errors.ghana_card_number &&
                        touched.ghana_card_number && (
                          <span className="text-red-500 pt-2 block fade-in">
                            {errors.ghana_card_number}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="ssnit_number"
                        className={`${styles.label}`}
                      >
                        SSNIT Number
                      </label>
                      <input
                        type="text"
                        id="ssnit_number"
                        value={values.ssnit_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Ex: C018310310039"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="ssnit_tier2_number"
                        className={`${styles.label}`}
                      >
                        Tier 2 Number
                      </label>
                      <input
                        type="text"
                        id="ssnit_tier2_number"
                        value={values.ssnit_tier2_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Ex: ET2M0571045"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="ssnit_tier3_number"
                        className={`${styles.label}`}
                      >
                        Tier 3 Number
                      </label>
                      <input
                        type="text"
                        id="ssnit_tier3_number"
                        value={values.ssnit_tier3_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Ex: ET2M0571569"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="tin_number" className={`${styles.label}`}>
                        TIN
                      </label>
                      <input
                        type="text"
                        id="tin_number"
                        value={values.tin_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter TIN"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="bank_id" className={`${styles.label}`}>
                        Bank Name
                      </label>
                      <AntdSelect
                        showSearch
                        placeholder="Select Bank"
                        optionFilterProp="children"
                        id="bank_id"
                        style={{ width: "100%", height: "38px" }}
                        value={values.bank_id || undefined}
                        onChange={(value) => {
                          setFieldValue("bank_id", value);
                          setFieldValue("bank_branch_id", "");
                        }}
                        filterOption={(input, option) =>
                          (option?.label as string)
                            ?.toLowerCase()
                            ?.includes(input.toLowerCase())
                        }
                        options={
                          bankList?.data?.map((bank: any) => ({
                            value: bank.id,
                            label: bank.name,
                          })) || []
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="bank_branch_id"
                        className={`${styles.label}`}
                      >
                        Bank Branch
                      </label>
                      <AntdSelect
                        showSearch
                        placeholder="Select Branch"
                        optionFilterProp="children"
                        id="bank_branch_id"
                        style={{ width: "100%", height: "38px" }}
                        value={values.bank_branch_id || undefined}
                        onChange={(value) => setFieldValue("bank_branch_id", value)}
                        filterOption={(input, option) =>
                          (option?.label as string)
                            ?.toLowerCase()
                            ?.includes(input.toLowerCase())
                        }
                        options={
                          branchList?.data?.map((branch: any) => ({
                            value: branch.id,
                            label: branch.name,
                          })) || []
                        }
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="bank_account_number"
                        className={`${styles.label}`}
                      >
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        id="bank_account_number"
                        value={values.bank_account_number}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.bank_account_number &&
                          touched.bank_account_number &&
                          "border-red-500"
                        }`}
                        placeholder="Enter Bank Account Number"
                      />
                      {errors.bank_account_number &&
                        touched.bank_account_number && (
                          <span className="text-red-500 pt-2 block fade-in">
                            {errors.bank_account_number}
                          </span>
                        )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="bank_account_name"
                        className={`${styles.label}`}
                      >
                        Bank Account Name
                      </label>
                      <input
                        type="text"
                        id="bank_account_name"
                        value={values.bank_account_name}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.bank_account_name &&
                          touched.bank_account_name &&
                          "border-red-500"
                        }`}
                        placeholder="Enter Bank Account Name"
                      />
                      {errors.bank_account_name &&
                        touched.bank_account_name && (
                          <span className="text-red-500 pt-2 block fade-in">
                            {errors.bank_account_name}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="marital_status"
                        className={`${styles.label}`}
                      >
                        Marital Status
                      </label>
                      <select
                        name="marital_status"
                        id="marital_status"
                        value={values.marital_status}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                        <option value="separated">Separated</option>
                      </select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

    

          <div className="overflow-x-auto mt-6 bg-white p-4 !hidden">
            <h1 className="text-[14.4px] font-medium mb-3">
              NEXT OF KIN & EMERGENCY CONTACT DETAILS
            </h1>

            <table className="table-auto w-full bg-white">
              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="nok_name" className={`${styles.label}`}>
                        NOK Name
                      </label>
                      <input
                        type="text"
                        id="nok_name"
                        value={values.nok_name}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Name"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="nok_relationship"
                        className={`${styles.label}`}
                      >
                        NOK Relationship
                      </label>
                      <input
                        type="text"
                        id="nok_relationship"
                        value={values.nok_relationship}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Relationship"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="nok_phone_number"
                        className={`${styles.label}`}
                      >
                        NOK Phone Number
                      </label>
                      <input
                        type="text"
                        id="nok_phone_number"
                        value={values.nok_phone_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="nok_email" className={`${styles.label}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="nok_email"
                        value={values.nok_email}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Email"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="emergency_contact_name"
                        className={`${styles.label}`}
                      >
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergency_contact_name"
                        value={values.emergency_contact_name}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Name"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="emergency_contact_number"
                        className={`${styles.label}`}
                      >
                        Emergency Phone Number
                      </label>
                      <input
                        type="text"
                        id="emergency_contact_number"
                        value={values.emergency_contact_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="emergency_contact_relationship"
                        className={`${styles.label}`}
                      >
                        Emergency Contact Relationship
                      </label>
                      <input
                        type="text"
                        id="emergency_contact_relationship"
                        value={values.emergency_contact_relationship}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Relationship"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto mt-6 bg-white p-4 !hidden">
            <h1 className="text-[14.4px] font-medium mb-3">
              RESIDENTIAL ADDRESS
            </h1>

            <table className="table-auto w-full bg-white">
              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="address" className={`${styles.label}`}>
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={values.address}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter House Address"
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label
                        htmlFor="house_number"
                        className={`${styles.label}`}
                      >
                        House Number
                      </label>
                      <input
                        type="text"
                        id="house_number"
                        value={values.house_number}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter House Number"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="ghana_post" className={`${styles.label}`}>
                        Ghana Post
                      </label>
                      <input
                        type="text"
                        id="ghana_post"
                        value={values.ghana_post}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Ghana Post ID"
                      />
                    </div>
                  </td>

                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="staff_community"
                        className={`${styles.label}`}
                      >
                        Staff Community
                      </label>
                      <input
                        type="text"
                        id="staff_community"
                        value={values.staff_community}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Staff Community e.g National"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="gra_resident"
                        className={`${styles.label}`}
                      >
                        Residence
                      </label>
                      <select
                        name="gra_resident"
                        id="gra_resident"
                        value={values.gra_resident}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>
                        <option value="resident">Resident</option>
                        <option value="non_resident">Non-Resident</option>
                      </select>
                    </div>
                  </td>

                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="resident_town"
                        className={`${styles.label}`}
                      >
                        Resident Town
                      </label>
                      <input
                        type="text"
                        id="resident_town"
                        value={values.resident_town}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Resident Town"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="hometown" className={`${styles.label}`}>
                        Hometown
                      </label>
                      <input
                        type="text"
                        id="hometown"
                        value={values.hometown}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Hometown"
                      />
                    </div>
                  </td>

                  {/* another field here */}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto mt-6 bg-white p-4">
            <h1 className="text-[14.4px] font-medium mb-3">
              EMPLOYMENT & ORGANIZATIONAL DETAILS
            </h1>

            <table className="table-auto w-full bg-white">
              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row items-center">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="country" className={`${styles.label}`}>
                        Country
                      </label>
                      <Select
                        id="country"
                        name="country"
                        options={options}
                        value={options.find(
                          (option) => option.label === formik.values.country
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("country", selectedOption?.label)
                        }
                        className={`${styles.form_input} !p-0`}
                        placeholder="Select Country"
                        isSearchable
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.label}
                      />
                    </div>
                  </td>

                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="entity_id" className={`${styles.label}`}>
                        Organizational Entity
                      </label>

                      <AntdSelect
                        showSearch
                        placeholder="Select Entity"
                        optionFilterProp="label"
                        style={{
                          width: "100%",
                          height: "38px",
                        }}
                        value={values.entity_id}
                        onChange={(value) => {
                          handleChange({
                            target: { name: "entity_id", value },
                          });
                        }}
                        filterOption={(input, option) =>
                          (option?.label as string)
                            ?.toLowerCase()
                            ?.includes(input.toLowerCase())
                        }
                      >
                        <Option value="">- - - - -</Option>
                        {entityFullList &&
                          entityFullList.data?.length > 0 &&
                          entityFullList.data?.map((entity: any, i: number) => (
                            <Option
                              key={i}
                              value={entity.id}
                              label={`${entity.name}`}
                            >
                              {`${entity.name}- (${entity.designation})`}
                            </Option>
                          ))}
                      </AntdSelect>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="gra_employment_type"
                        className={`${styles.label}`}
                      >
                        Employee Assignment
                      </label>
                      <select
                        name="gra_employment_type"
                        id="gra_employment_type"
                        value={values.gra_employment_type}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>

                        <option value="permanent">Permanent</option>
                        <option value="contract">Contract</option>
                        <option value="part_time">Part-Time</option>
                        <option value="casual">Casual</option>
                        <option value="expatriate">Expatriate</option>
                      </select>
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="grade_id" className={`${styles.label}`}>
                        Rank
                      </label>
                      <AntdSelect
                        showSearch
                        placeholder="Select Rank"
                        optionFilterProp="label"
                        style={{
                          width: "100%",
                          height: "38px",
                        }}
                        value={
                          values.grade_id ||
                          rankList?.data?.find(
                            (rank: any) => rank.name === "Not Specified"
                          )?._id ||
                          undefined
                        }
                        onChange={(value) => {
                          handleChange({
                            target: { name: "grade_id", value },
                          });
                        }}
                        filterOption={(input, option) =>
                          (option?.label as string)
                            ?.toLowerCase()
                            ?.includes(input.toLowerCase())
                        }
                      >
                        <Option value="">------</Option>
                        {rankList &&
                          rankList.data !== null &&
                          rankList.data.map((rank: any, i: number) => (
                            <Option key={i} value={rank._id} label={rank.name}>
                              {rank.name}
                            </Option>
                          ))}
                      </AntdSelect>
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="rank_title" className={`${styles.label}`}>
                        Rank Title
                      </label>
                      <input
                        type="text"
                        id="rank_title"
                        name="rank_title"
                        value={values.rank_title}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Rank Title (e.g Acting Director)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2 border-l-0">
                    <div>
                      <label htmlFor="notch" className={`${styles.label}`}>
                        Notch
                      </label>
                      {values.grade_id &&
                      rankList?.data?.find(
                        (rank: any) => rank._id === values.grade_id
                      )?.notches ? (
                        <AntdSelect
                          showSearch
                          placeholder="Select Notch"
                          optionFilterProp="label"
                          style={{
                            width: "100%",
                            height: "38px",
                          }}
                          value={values.notch || undefined}
                          onChange={(value) => {
                            handleChange({
                              target: { name: "notch", value },
                            });
                          }}
                          filterOption={(input, option) =>
                            (option?.label as string)
                              ?.toLowerCase()
                              ?.includes(input.toLowerCase())
                          }
                        >
                          <Option value="">------</Option>
                          {Object.keys(
                            rankList?.data?.find(
                              (rank: any) => rank._id === values.grade_id
                            )?.notches || {}
                          ).map((notchKey: string) => (
                            <Option key={notchKey} value={notchKey} label={notchKey}>
                              {notchKey}
                            </Option>
                          ))}
                        </AntdSelect>
                      ) : (
                        <div className="w-full h-9 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 text-sm">
                          Select a rank first
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="staff_skill"
                        className={`${styles.label}`}
                      >
                        Staff Skill
                      </label>
                      <input
                        type="text"
                        id="staff_skill"
                        value={values.staff_skill}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder="Enter Staff Skill"
                      />
                    </div>
                  </td>

                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="gra_position"
                        className={`${styles.label}`}
                      >
                        Employee Type (Position)
                      </label>
                      <select
                        name="gra_position"
                        id="gra_position"
                        value={values.gra_position}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>

                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="management">Management</option>
                        {/* <option value="other">Other</option> */}
                      </select>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="hire_start_date"
                        className={`${styles.label}`}
                      >
                        Hire Date
                      </label>
                      <input
                        type="date"
                        id="hire_start_date"
                        value={values.hire_start_date}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.hire_start_date &&
                          touched.hire_start_date &&
                          "border-red-500"
                        }`}
                        placeholder=""
                      />
                      {errors.hire_start_date && touched.hire_start_date && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.hire_start_date}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="hire_end_date"
                        className={`${styles.label}`}
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        id="hire_end_date"
                        value={values.hire_end_date}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.hire_end_date &&
                          touched.hire_end_date &&
                          "border-red-500"
                        }`}
                        placeholder=""
                      />
                      {errors.hire_end_date && touched.hire_end_date && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.hire_end_date}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="effective_date_of_last_promotion"
                        className={`${styles.label}`}
                      >
                        Effective Date of Last Promotion
                      </label>
                      <input
                        type="date"
                        id="effective_date_of_last_promotion"
                        value={values.effective_date_of_last_promotion}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                        placeholder=""
                      />
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label
                        htmlFor="assumption_date"
                        className={`${styles.label}`}
                      >
                        Assumption Date
                      </label>
                      <input
                        type="date"
                        id="assumption_date"
                        value={values.assumption_date}
                        onChange={handleChange}
                        className={`${styles.form_input} ${
                          errors.assumption_date &&
                          touched.assumption_date &&
                          "border-red-500"
                        }`}
                        placeholder=""
                      />
                      {errors.assumption_date && touched.assumption_date && (
                        <span className="text-red-500 pt-2 block fade-in">
                          {errors.assumption_date}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div>
                      <label htmlFor="status" className={`${styles.label}`}>
                        Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={values.status}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>
                        {statusList &&
                          statusList.data !== null &&
                          statusList.data.map((status: any, i: number) => (
                            <option key={i} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </td>
                  <td className="w-full md:w-1/2 p-2">
                    <div className="">
                      <label htmlFor="wage_type" className={`${styles.label}`}>
                        Wage Type
                      </label>
                      <select
                        name="wage_type"
                        id="wage_type"
                        value={values.wage_type}
                        onChange={handleChange}
                        className={`${styles.form_input}`}
                      >
                        <option value="">------</option>

                        <option value="established">Established</option>
                        <option value="clock_in">Clock-In</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </td>
                </tr>
              </tbody>

          

              <tbody className="divide-y">
                <tr className="flex flex-col md:flex-row ">
                  <td className="w-full md:w-1/2 p-2">
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        name="subcontractor"
                        id="subcontractor"
                        checked={values.subcontractor}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="subcontractor"
                        className={`${styles.label}`}
                      >
                        A Subcontractor
                      </label>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        name="consultant"
                        id="consultant"
                        checked={values.consultant}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label htmlFor="consultant" className={`${styles.label}`}>
                        A Consultant
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_tax_payer"
                        id="is_tax_payer"
                        checked={values.is_tax_payer}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="is_tax_payer"
                        className={`${styles.label}`}
                      >
                        A Tax Payer
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_ssnit_payer"
                        id="is_ssnit_payer"
                        checked={values.is_ssnit_payer}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="is_ssnit_payer"
                        className={`${styles.label}`}
                      >
                        A SSNIT Payer
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_auto_notch_update"
                        id="is_auto_notch_update"
                        checked={values.is_auto_notch_update}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="is_auto_notch_update"
                        className={`${styles.label}`}
                      >
                        Auto Notch Update
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_auto_status_update"
                        id="is_auto_status_update"
                        checked={values.is_auto_status_update}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="is_auto_status_update"
                        className={`${styles.label}`}
                      >
                        Auto Status Update
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_payroll_eligible"
                        id="is_payroll_eligible"
                        checked={values.is_payroll_eligible}
                        onChange={handleChange}
                        className="w-4 h-4 checked:border-transparent rounded focus:outline-none"
                      />
                      <label
                        htmlFor="is_payroll_eligible"
                        className={`${styles.label}`}
                      >
                        Payroll Eligible
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto mt-6 bg-white p-4 ">
            <h1 className="text-[14.4px] font-medium mb-3">QUALIFICATIONS</h1>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-2">
                {/* Academic Qualifications Section */}
                <p className="font-medium text-xl">Academic</p>
                <br />
                {values.academic_qualifications?.map((qualification, index) => (
                  <div key={index} className="mb-4">
                    <section className="flex gap-2 mb-3">
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={qualification.name}
                          placeholder="Ex: Bsc Computer Science"
                          className={`${styles.input}`}
                          onChange={(e) => handleQualificationChange(index, e)}
                        />
                      </div>
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Institution</label>
                        <input
                          type="text"
                          name="institution"
                          value={qualification.institution}
                          placeholder="Ex: University of Ghana, Legon"
                          className={`${styles.input}`}
                          onChange={(e) => handleQualificationChange(index, e)}
                        />
                      </div>
                    </section>
                    <section className="flex gap-2">
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={qualification.start_date}
                          className={`${styles.input}`}
                          onChange={(e) => handleQualificationChange(index, e)}
                        />
                      </div>
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>End Date</label>
                        <input
                          type="date"
                          name="end_date"
                          value={qualification.end_date}
                          className={`${styles.input}`}
                          onChange={(e) => handleQualificationChange(index, e)}
                        />
                      </div>
                    </section>

                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-[4px] rounded-sm mt-2"
                      onClick={() => removeQualification(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-[#39afd1] text-white px-3 py-[4px] rounded-sm"
                  onClick={addQualification}
                >
                  +
                </button>
              </div>

              <div className="w-full md:w-1/2 p-2">
                {/* Professional Qualifications Section */}
                <p className="font-medium text-xl">Professional</p>
                <br />
                {values.professional_qualifications?.map(
                  (qualification, index) => (
                    <div key={index} className="mb-4">
                      <section className="flex gap-2 mb-3">
                        <div className="flex flex-col w-[45%]">
                          <label className={`${styles.label}`}>Name</label>
                          <input
                            type="text"
                            name="name"
                            value={qualification.name}
                            placeholder="Ex: Chartered Accountant (CA)"
                            className={`${styles.input}`}
                            onChange={(e) =>
                              handleProfessionalQualificationChange(index, e)
                            }
                          />
                        </div>
                        <div className="flex flex-col w-[45%]">
                          <label className={`${styles.label}`}>
                            Institution
                          </label>
                          <input
                            type="text"
                            name="institution"
                            value={qualification.institution}
                            placeholder="Ex:  Institute of Chartered Accountants"
                            className={`${styles.input}`}
                            onChange={(e) =>
                              handleProfessionalQualificationChange(index, e)
                            }
                          />
                        </div>
                      </section>
                      <section className="flex gap-2">
                        <div className="flex flex-col w-[45%]">
                          <label className={`${styles.label}`}>
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="start_date"
                            value={qualification.start_date}
                            className={`${styles.input}`}
                            onChange={(e) =>
                              handleProfessionalQualificationChange(index, e)
                            }
                          />
                        </div>
                        <div className="flex flex-col w-[45%]">
                          <label className={`${styles.label}`}>End Date</label>
                          <input
                            type="date"
                            name="end_date"
                            value={qualification.end_date}
                            className={`${styles.input}`}
                            onChange={(e) =>
                              handleProfessionalQualificationChange(index, e)
                            }
                          />
                        </div>
                      </section>

                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-[4px] rounded-sm mt-2"
                        onClick={() => removeProfessionalQualification(index)}
                      >
                        -
                      </button>
                    </div>
                  )
                )}
                <button
                  type="button"
                  className="bg-[#39afd1] text-white px-3 py-[4px] rounded-sm"
                  onClick={addProfessionalQualification}
                >
                  +
                </button>
              </div>
            </div>

            <br />
            <br />

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-2">
                {/* Training Qualifications Section */}
                <p className="font-medium text-xl">Trainings</p>
                <br />
                {values.trainings?.map((qualification, index) => (
                  <div key={index} className="mb-4">
                    <section className="flex gap-2 mb-3">
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={qualification.name}
                          placeholder="Ex: Project Management"
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Institution</label>
                        <input
                          type="text"
                          name="body"
                          value={qualification.body}
                          placeholder="The Institution"
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                    </section>
                    <section className="flex gap-2 mb-3">
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>
                          Certification
                        </label>
                        <input
                          type="text"
                          name="certification"
                          value={qualification.certification}
                          placeholder="Ex: Agile Certified Practitioner (PMI-ACP)."
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Date Issued</label>
                        <input
                          type="date"
                          name="start_date"
                          value={qualification.start_date}
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                    </section>

                    <section className="flex gap-2 mb-3">
                      <div className="flex items-center gap-3 w-[45%]">
                        <label
                          className={`${styles.label} text-blue-600 font-extrabold`}
                        >
                          Mark as Expiring Training
                        </label>
                        <input
                          type="checkbox"
                          name="expires"
                          className="w-6 h-6 focus:ring-2 focus:ring-blue-500"
                          checked={qualification.expires}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                      <div
                        className={`flex flex-col w-[45%] ${
                          qualification?.expires === false && "hidden"
                        }`}
                      >
                        <label className={`${styles.label}`}>
                          Expiry Date
                          <span className="text-[red]">
                            (Required if the training expires*)
                          </span>
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          required={qualification?.expires}
                          value={
                            qualification?.expires
                              ? qualification.end_date || ""
                              : ""
                          }
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleTrainingQualificationChange(index, e)
                          }
                        />
                      </div>
                    </section>

                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-[4px] rounded-sm mt-2"
                      onClick={() => removeTrainingQualification(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-[#39afd1] text-white px-3 py-[4px] rounded-sm"
                  onClick={addTrainingQualification}
                >
                  +
                </button>
              </div>

              <div className="w-full md:w-1/2 p-2">
                {/*Speciall Skills  Section */}
                <p className="font-medium text-xl">Special Skills</p>
                <br />
                {values.special_skills?.map((qualification, index) => (
                  <div key={index} className="mb-4">
                    <section className="flex gap-2 mb-3">
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={qualification.name}
                          placeholder="Ex: Data Analysis"
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleSkillsQualificationChange(index, e)
                          }
                        />
                      </div>
                      <div className="flex flex-col w-[45%]">
                        <label className={`${styles.label}`}>Institution</label>
                        <input
                          type="text"
                          name="proficiency_level"
                          value={qualification.proficiency_level}
                          placeholder="Ex: Intermediate"
                          className={`${styles.input}`}
                          onChange={(e) =>
                            handleSkillsQualificationChange(index, e)
                          }
                        />
                      </div>
                    </section>

                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-[4px] rounded-sm mt-2"
                      onClick={() => removeSkillsQualification(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-[#39afd1] text-white px-3 py-[4px] rounded-sm"
                  onClick={addSkillsQualification}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-6 bg-white p-4 max-sm:flex-wrap">
            <div className="flex items-center justify-center gap-8">
              <button
                className="bg-[#727cf5] hover:bg-[#5b65c7] min-h-[35px] w-[100px] text-[13px] font-[600] text-white transition-all duration-300"
                type="submit"
              >
                {isLoading ? "Please wait" : "Submit"}
              </button>
              <button
                className=" border border-[#727cf5] hover:bg-[#5b65c7] hover:text-white min-h-[35px] w-[100px] text-[13px] font-[600]  transition-all duration-300"
                onClick={() => formik.resetForm()}
              >
                Clear
              </button>
              <button
                className=" border border-[#727cf5] hover:bg-[#5b65c7] hover:text-white min-h-[35px] w-[100px] text-[13px] font-[600]  transition-all duration-300"
                onClick={() => {
                  if (isDrawer && onClose) {
                    onClose();
                  } else {
                    navigate("/employees");
                  }
                }}
              >
                {isDrawer ? "Close" : "Go to the list"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
