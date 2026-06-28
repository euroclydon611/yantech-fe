import { styles } from "../../../styles";
import { Select, Drawer, Tag } from "antd";
const { Option } = Select;
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  usePmeStoreMutation,
  usePmeFullListQuery,
} from "../../../redux/features/configurations/pmeApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import { useRankFullListQuery } from "../../../redux/features/sections/ranksApi";
import Swal from "sweetalert2";
import { MdFilterList, MdFilterListOff } from "react-icons/md";

const schema = Yup.object().shape({
  name: Yup.string().required("PME name is required"),
  level: Yup.string().required("Level is required"),
  type: Yup.string().required("Type is required"),
  allowance_uom: Yup.string(),
  from_date: Yup.date().nullable().typeError("Invalid date format"),
  to_date: Yup.date()
    .nullable()
    .min(Yup.ref("from_date"), "End date cannot be earlier than the start date")
    .typeError("Invalid date format"),
});

interface AddPMEProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddPME = ({ open, onClose, refetch }: AddPMEProps) => {
  const [allowance_perc_allowances_ids, setAllowance_perc_allowances_ids] =
    useState([]);
  const [deduction_perc_allowances_ids, setDeduction_perc_allowances_ids] =
    useState([]);

  const [employees, setEmployees] = useState([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [gender, setGender] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [graEmploymentType, setGraEmploymentType] = useState("");
  const [graPosition, setGraPosition] = useState("");

  const [pmeStore, { data, isSuccess, isLoading, error }] =
    usePmeStoreMutation();

  const { data: employeeList } = useEmployeeFullListQuery({
    gender,
    grade_id: gradeId,
    gra_employment_type: graEmploymentType,
    gra_position: graPosition,
  }, { skip: !open });
  const { data: allowancesList } = usePmeFullListQuery({}, { skip: !open });
  const { data: rankList } = useRankFullListQuery({}, { skip: !open });

  const formik = useFormik({
    initialValues: {
      name: "",
      level: "",
      type: "",
      from_date: "",
      to_date: "",
      users: employees,
      allowance_uom: "",
      allowance_amount: "",
      allowance_percentage: "",
      allowance_percentage_to: "",
      allowance_category: "taxable",
      // allowance_perc_allowances_ids: [],
      deduction_uom: "",
      deduction_amount: "",
      deduction_percentage: "",
      deduction_percentage_to: "",
      deduction_category: "",
      // deduction_perc_allowances_ids: "",
      bonus_amount: "",
    },
    validationSchema: schema,
    onSubmit: async ({
      name,
      level,
      type,
      from_date,
      to_date,
      allowance_uom,
      allowance_amount,
      allowance_percentage,
      allowance_percentage_to,
      allowance_category,
      deduction_uom,
      deduction_amount,
      deduction_percentage,
      deduction_percentage_to,
      deduction_category,
      bonus_amount,
    }) => {
      await pmeStore({
        name,
        level,
        type,
        allowance_uom,
        allowance_amount,
        from_date,
        to_date,
        users: employees.filter((id) => id !== ""),
        allowance_percentage,
        allowance_percentage_to,
        allowance_perc_allowances_ids,
        allowance_category,
        deduction_uom,
        deduction_amount,
        deduction_percentage,
        deduction_percentage_to,
        deduction_perc_allowances_ids,
        deduction_category,
        bonus_amount,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setEmployees([]);
      setAllowance_perc_allowances_ids([]);
      setDeduction_perc_allowances_ids([]);
      setShowFilters(false);
      setGender("");
      setGradeId("");
      setGraEmploymentType("");
      setGraPosition("");
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch();
          onClose();
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
          // timer: 5000,
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Drawer
      title="Add PME"
      onClose={onClose}
      open={open}
      width={900}
      maskClosable={false}
    >
      <div className="fade-in">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/epa-logo.png" alt="EPA Logo" className="h-12" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            PME's Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Payroll Monetary Element's Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="level" className={`${styles.label}`}>
            Select Level
          </label>
          <select
            name="level"
            id="level"
            value={values.level}
            onChange={handleChange}
            className={`${styles.input}`}
          >
            <option value="">------</option>
            <option value="General">General</option>
            <option value="Personal">Personal</option>
          </select>
          {errors.level && touched.level && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.level}
            </span>
          )}
        </div>
        {values.level === "Personal" && (
          <>
            {/* Advanced Filters Toggle */}
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-800"
              >
                {showFilters ? <MdFilterListOff size={18} /> : <MdFilterList size={18} />}
                {showFilters ? "Hide Filters" : "Advanced Filters"}
              </button>
            </div>

            {/* Advanced Filters UI */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md mb-4 border border-gray-100">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500 uppercase">Gender</label>
                  <Select
                    placeholder="All Genders"
                    value={gender || undefined}
                    onChange={(val) => setGender(val || "")}
                    size="small"
                    className="w-full"
                  >
                    <Option value="">All Genders</Option>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500 uppercase">Rank</label>
                  <Select
                    showSearch
                    placeholder="All Ranks"
                    value={gradeId || undefined}
                    onChange={(val) => setGradeId(val || "")}
                    size="small"
                    className="w-full"
                    optionFilterProp="children"
                  >
                    <Option value="">All Ranks</Option>
                    {rankList?.data?.map((r: any) => (
                      <Option key={r._id} value={r._id}>{r.name}</Option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500 uppercase">Employment Type</label>
                  <Select
                    placeholder="All Types"
                    value={graEmploymentType || undefined}
                    onChange={(val) => setGraEmploymentType(val || "")}
                    size="small"
                    className="w-full"
                  >
                    <Option value="">All Types</Option>
                    <Option value="permanent">Permanent</Option>
                    <Option value="contract">Contract</Option>
                    {/* <Option value="casual">Casual</Option> */}
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-gray-500 uppercase">Position</label>
                  <Select
                    placeholder="All Positions"
                    value={graPosition || undefined}
                    onChange={(val) => setGraPosition(val || "")}
                    size="small"
                    className="w-full"
                  >
                    <Option value="">All Positions</Option>
                    <Option value="senior">Senior</Option>
                    <Option value="junior">Junior</Option>
                  </Select>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="level" className={`${styles.label} flex justify-between items-center`}>
                <span>Select Employees <Tag color="blue" className="text-sm ml-2">Selected: ({employees.length})</Tag></span>
                <button
                  type="button"
                  onClick={() => {
                    const allFilteredIds = employeeList?.map((e: any) => e.id) || [];
                    setEmployees(Array.from(new Set([...employees, ...allFilteredIds])));
                  }}
                  className="text-[11px] text-blue-500 hover:underline"
                >
                  Select All Filtered
                </button>
              </label>
              <Select
                mode="multiple"
                showSearch
                id="employees"
                style={{ width: "100%" }}
                placeholder="Choose..."
                value={employees}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(selectedOptions: any) => {
                  const isSelectAllSelected = selectedOptions.includes("");
                  const wasSelectAllSelected = employees.includes("");

                  if (isSelectAllSelected && !wasSelectAllSelected) {
                    // If "Select All" is selected, set employees to all options including "Select All"
                    setEmployees(
                      employeeList
                        .map((employee: any) => employee.id)
                        .concat("")
                    );
                  } else if (!isSelectAllSelected && wasSelectAllSelected) {
                    // If "Select All" is deselected, clear all
                    setEmployees([]);
                  } else if (
                    isSelectAllSelected &&
                    selectedOptions.length < employees.length
                  ) {
                    // If an individual employee is deselected while "Select All" is active, remove "Select All"
                    setEmployees(selectedOptions.filter((id: any) => id !== ""));
                  } else {
                    // Update the state with the selected options
                    setEmployees(selectedOptions);
                  }
                }}
              >
                {/* "Select All" option */}
                <Option value="" label="Select All">
                  Select All
                </Option>

                {/* Employee options */}
                {employeeList &&
                  employeeList.map((employee: any, i: number) => (
                    <Option
                      key={i}
                      value={employee.id}
                      label={`${employee.staff_id} - ${employee.firstname} ${employee.lastname}`} // Set label for search
                    >
                      {employee.staff_id} - {employee.firstname}{" "}
                      {employee.lastname}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="flex justify-between">
              <div className="w-[45%]">
                <label htmlFor="fromDate" className={`${styles.label}`}>
                  From
                </label>
                <input
                  type="date"
                  name="from_date"
                  id="from_date"
                  value={values.from_date}
                  onChange={handleChange}
                  className={styles.input}
                />
                {errors.from_date && touched.from_date && (
                  <span className="text-red-500 pt-2 block fade-in">
                    {errors.from_date}
                  </span>
                )}
              </div>
              <div className="w-[45%]">
                <label htmlFor="toDate" className={`${styles.label} `}>
                  To
                </label>
                <input
                  type="date"
                  name="to_date"
                  id="to_date"
                  value={values.to_date}
                  onChange={handleChange}
                  className={`${styles.input}`}
                />
                {errors.to_date && touched.to_date && (
                  <span className="text-red-500 pt-2 block fade-in">
                    {errors.to_date}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
        <div>
          <label htmlFor="type" className={`${styles.label}`}>
            Select Type
          </label>
          <select
            name="type"
            id="type"
            value={values.type}
            onChange={handleChange}
            className={`${styles.input}`}
          >
            <option value="">------</option>
            <option value="allowance">Allowance</option>
            <option value="deduction">Deduction</option>
            <option value="bonus">Bonus</option>
          </select>
          {errors.type && touched.type && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.type}
            </span>
          )}
        </div>
        {values.type?.toLowerCase() === "allowance" && (
          <>
            <div>
              <label htmlFor="allowance_uom" className={`${styles.label}`}>
                Select Allowance Type
              </label>
              <select
                name="allowance_uom"
                id="allowance_uom"
                value={values.allowance_uom}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="">------</option>
                <option value="amount">Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div>
              <label htmlFor="allowance_category" className={`${styles.label}`}>
                Select Allowance Category
              </label>
              <select
                name="allowance_category"
                id="allowance_category"
                value={values.allowance_category}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="taxable">Taxable</option>
                <option value="non-taxable">Non-Taxable</option>
              </select>
            </div>

            {values.allowance_uom === "amount" && (
              <>
                <div>
                  <label
                    htmlFor="allowance_amount"
                    className={`${styles.label}`}
                  >
                    Allowance Amount
                  </label>
                  <input
                    type="number"
                    id="allowance_amount"
                    value={values.allowance_amount}
                    onChange={handleChange}
                    className={`${styles.input}`}
                    placeholder="Enter Allowance Amount"
                  />
                </div>
              </>
            )}
            {values.allowance_uom === "percentage" && (
              <>
                <div>
                  <label
                    htmlFor="allowance_percentage"
                    className={`${styles.label}`}
                  >
                    Allowance Percentage
                  </label>
                  <input
                    type="number"
                    id="allowance_percentage"
                    value={values.allowance_percentage}
                    max={100}
                    onChange={handleChange}
                    className={`${styles.input}`}
                    placeholder="Enter Allowance Percentage"
                  />
                </div>
                <div>
                  <label
                    htmlFor="allowance_percentage_to"
                    className={`${styles.label}`}
                  >
                    Apply to
                  </label>
                  <select
                    name="allowance_percentage_to"
                    id="allowance_percentage_to"
                    value={values.allowance_percentage_to}
                    onChange={handleChange}
                    className={`${styles.input}`}
                  >
                    <option value="">------</option>
                    <option value="salary">Basic Salary</option>
                    <option value="allowances">Allowances</option>
                  </select>
                </div>
              </>
            )}

            {values.allowance_percentage_to === "allowances" && (
              <>
                <div>
                  <label htmlFor="allowance_perc_allowances_ids">
                    Select Allowances
                  </label>
                  <Select
                    mode="multiple"
                    id="allowance_perc_allowances_ids"
                    style={{ width: "100%" }}
                    placeholder="Choose..."
                    value={allowance_perc_allowances_ids}
                    onChange={(selectedOptions) =>
                      setAllowance_perc_allowances_ids(selectedOptions)
                    }
                  >
                    {/* <Option value="">s</Option> */}
                    {allowancesList &&
                      allowancesList.data !== null &&
                      allowancesList.data
                        .filter(
                          (allowance: any) => allowance.type === "allowance"
                        )
                        .map((allowance: any) => (
                          <Option key={allowance._id} value={allowance._id}>
                            {allowance.name}
                          </Option>
                        ))}
                  </Select>
                </div>
              </>
            )}
          </>
        )}

        {values.type?.toLowerCase() === "deduction" && (
          <>
            <div>
              <label htmlFor="deduction_uom" className={`${styles.label}`}>
                Select Deduction Type
              </label>
              <select
                name="deduction_uom"
                id="deduction_uom"
                value={values.deduction_uom}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="">------</option>
                <option value="amount">Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div>
              <label htmlFor="deduction_category" className={`${styles.label}`}>
                Select Deduction Category
              </label>
              <select
                name="deduction_category"
                id="deduction_category"
                value={values.deduction_category}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="">------</option>
                <option value="tier_3">Tier 3 (Non Taxable)</option>
                <option value="tier_3_taxable">Tier 3 (Taxable)</option>
                <option value="other">Other (Taxable)</option>
                <option value="welfare">Welfare (Taxable)</option>
              </select>
            </div>

            {values.deduction_uom === "amount" && (
              <>
                <div>
                  <label
                    htmlFor="deduction_amount"
                    className={`${styles.label}`}
                  >
                    Deduction Amount
                  </label>
                  <input
                    type="number"
                    id="deduction_amount"
                    value={values.deduction_amount}
                    onChange={handleChange}
                    className={`${styles.input}`}
                    placeholder="Enter Deduction Amount"
                  />
                </div>
              </>
            )}

            {values.deduction_uom === "percentage" && (
              <>
                <div>
                  <label
                    htmlFor="deduction_percentage"
                    className={`${styles.label}`}
                  >
                    Deduction Percentage
                  </label>
                  <input
                    type="number"
                    id="deduction_percentage"
                    value={values.deduction_percentage}
                    max={100}
                    onChange={handleChange}
                    className={`${styles.input}`}
                    placeholder="Enter Deduction Percentage"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deduction_percentage_to"
                    className={`${styles.label}`}
                  >
                    Apply to
                  </label>
                  <select
                    name="deduction_percentage_to"
                    id="deduction_percentage_to"
                    value={values.deduction_percentage_to}
                    onChange={handleChange}
                    className={`${styles.input}`}
                  >
                    <option value="">------</option>
                    <option value="salary">Basic Salary</option>
                    <option value="gross">Gross Salary</option>
                    <option value="allowances">Allowances</option>
                  </select>
                </div>

                {values.deduction_percentage_to === "allowances" && (
                  <>
                    <div>
                      <label htmlFor="allowance_perc_allowances_ids">
                        Select Allowances
                      </label>
                      <Select
                        mode="multiple"
                        id="deduction_perc_allowances_ids"
                        style={{ width: "100%" }}
                        placeholder="Choose..."
                        value={deduction_perc_allowances_ids}
                        onChange={(selectedOptions) =>
                          setDeduction_perc_allowances_ids(selectedOptions)
                        }
                      >
                        {/* <Option value="">s</Option> */}
                        {allowancesList &&
                          allowancesList.data !== null &&
                          allowancesList.data
                            .filter(
                              (allowance: any) => allowance.type === "allowance"
                            )
                            .map((allowance: any) => (
                              <Option key={allowance._id} value={allowance._id}>
                                {allowance.name}
                              </Option>
                            ))}
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {values.type?.toLowerCase() === "bonus" && (
          <>
            <div>
              <label htmlFor="allowance_category" className={`${styles.label}`}>
                Select Allowance Category
              </label>
              <select
                name="allowance_category"
                id="allowance_category"
                value={values.allowance_category}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="taxable">Taxable</option>
                <option value="non-taxable">Non-Taxable</option>
              </select>
            </div>
            <div>
              <label htmlFor="bonus_amount" className={`${styles.label}`}>
                Bonus Amount
              </label>
              <input
                type="number"
                id="bonus_amount"
                value={values.bonus_amount}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Enter Bonus Amount"
              />
            </div>
          </>
        )}

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn}`} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
        </form>
      </div>
    </Drawer>
  );
};

export default AddPME;
