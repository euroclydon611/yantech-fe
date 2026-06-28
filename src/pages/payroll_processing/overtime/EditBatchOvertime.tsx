import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Select } from "antd";
const { Option } = Select;
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useEntityStaffsQuery } from "../../../redux/features/employee-portal-api/entityApi";
import { useBatchOvertimeDecisionAdminMutation } from "../../../redux/features/reports/payrollRun";
import { useOvertimeFullListQuery } from "../../../redux/features/configurations/overtimeApi";

const schema = Yup.object().shape({
  overtime_config_id: Yup.string().required("Overtime type is required"),
  overtime_date: Yup.string().required("Overtime date is required"),
  decision_note: Yup.string().required("Please leave a short note"),
});

const EditBatchOvertime = ({ itemData, setOpen, refetch }: any) => {
  const { employee } = useSelector((state: RootState) => state.employee_auth);
  const [employee_ids, setEmployeesIDS] = useState(
    itemData?.employee_ids || []
  );

  const { data: overtimeList } = useOvertimeFullListQuery({});

  const { data: employeeList } = useEntityStaffsQuery({
    page: 1,
    limit: 100000,
    searchTerm: "",
    sortOrder: "asc",
    entity_id: employee?.entity?._id,
  });

  const [overtimeDecision, { data, isSuccess, isLoading, error }] =
    useBatchOvertimeDecisionAdminMutation();

  const formik = useFormik({
    initialValues: {
      overtime_config_id: (itemData?.overtime_config_id as string) || "",
      overtime_date:
        (itemData?.overtime_date?.substring(0, 10) as string) || "",
      status: (itemData?.status as string) || "",
      decision_note: "",
    },
    validationSchema: schema,
    onSubmit: async ({
      overtime_config_id,
      overtime_date,
      decision_note,
      status,
    }) => {
      if (employee_ids.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Employee(s) required",
          text: "Please select at least one employee before submitting.",
        });
        return;
      }

      await overtimeDecision({
        overtime_id: itemData?._id,
        overtime_config_id,
        overtime_date,
        employee_ids,
        decision_note,
        status,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";

      Swal.fire({
        title: message,
        icon: "success",
        // timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch();
          setOpen(false);
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

  const { errors, touched, values, setFieldValue, handleChange, handleSubmit } =
    formik;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <h2 className="text-center text-lg my-3">Batch Overtime Actions</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="overtime_config_id" className={`${styles.label}`}>
            Overtime type
          </label>
          <Select
            id="overtime_config_id"
            style={{ width: "100%" }}
            value={values.overtime_config_id} // Assuming this is the selected value
            onChange={(value) => setFieldValue("overtime_config_id", value)} // Update formik's value
            placeholder="Select Overtime Type"
            disabled
          >
            <Option value="">- - - - - -</Option>
            {overtimeList &&
              overtimeList?.data?.length > 0 &&
              overtimeList?.data?.map((overtime: any) => (
                <Option key={overtime._id} value={overtime._id}>
                  {overtime.name}
                </Option>
              ))}
          </Select>

          {errors.overtime_config_id && touched.overtime_config_id && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.overtime_config_id}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="overtime_date" className={`${styles.label}`}>
            Date
          </label>
          <input
            disabled
            readOnly
            type="date"
            id="overtime_date"
            value={values.overtime_date}
            onChange={handleChange}
            className={`${styles.input} disabled:bg-gray-100`}
          />
          {errors.overtime_date && touched.overtime_date && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.overtime_date}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="level" className={`${styles.label}`}>
            Select Employees
          </label>
          <Select
            disabled
            mode="multiple"
            showSearch
            id="employees"
            style={{ width: "100%" }}
            placeholder="Choose..."
            value={employee_ids}
            optionFilterProp="label"
            filterOption={(input, option) => {
              const label = option?.label as string;
              if (label) {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
            onChange={(selectedOptions: any) => {
              if (selectedOptions.includes("")) {
                setEmployeesIDS(
                  employeeList?.data
                    ?.map((employee: any) => employee._id)
                    .concat("")
                );
              } else {
                setEmployeesIDS(selectedOptions);
              }
            }}
          >
            <Option value="">Select All</Option>
            {employeeList?.data &&
              employeeList?.data?.length > 0 &&
              employeeList?.data
                ?.filter((emp: any) => emp._id !== employee._id)
                ?.map((employee: any, i: number) => (
                  <Option
                    key={i}
                    value={employee._id}
                    label={`${employee.staff_id} - ${employee.firstname} ${employee.lastname}`}
                  >
                    {employee.staff_id} - {employee.firstname}{" "}
                    {employee.lastname}
                  </Option>
                ))}
          </Select>
        </div>

        <div>
          <label htmlFor="status" className={`${styles.label}`}>
            Take Action
          </label>
          <select
            name="status"
            id="status"
            value={values.status}
            onChange={handleChange}
            className={`${styles.input} !border-orange-700`}
          >
            <option value="">- - - - - - </option>
            <option value="pending">Pending</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
          {errors.status && touched.status && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.status}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="decision_note" className={`${styles.label}`}>
            Decision Note
          </label>
          <textarea
            id="decision_note"
            value={values.decision_note}
            onChange={handleChange}
            className={`w-full text-[14px]  border h-[100px] rounded text-[#6c757d] px-2 outline-none mt-[4px] !border-orange-700`}
            placeholder="Add extra note"
          />
          {errors.decision_note && touched.decision_note && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.decision_note}
            </span>
          )}
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn}`}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default EditBatchOvertime;
