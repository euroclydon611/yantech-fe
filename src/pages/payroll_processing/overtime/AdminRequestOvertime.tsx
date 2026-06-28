import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Select } from "antd";
const { Option } = Select;
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import { useOvertimeRequestAdminMutation } from "../../../redux/features/reports/payrollRun";
import { useOvertimeFullListQuery } from "../../../redux/features/configurations/overtimeApi";

const schema = Yup.object().shape({
  overtime_config_id: Yup.string().required("Overtime type is required"),
  overtime_date: Yup.string().required("Overtime date is required"),
});

const AdminRequestOvertime = ({ setOpen, refetch }: any) => {
  const [employee_ids, setEmployeesIDS] = useState([]);

  const { data: employeeList } = useEmployeeFullListQuery({});
  const { data: overtimeList } = useOvertimeFullListQuery({});

  const [requestOvertime, { data, isSuccess, isLoading, error }] =
    useOvertimeRequestAdminMutation();

  const formik = useFormik({
    initialValues: {
      overtime_config_id: "",
      overtime_date: "",
    },
    validationSchema: schema,
    onSubmit: async ({ overtime_config_id, overtime_date }) => {
      await requestOvertime({
        overtime_config_id,
        overtime_date,
        employee_ids,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
      const { created, failed } = data?.data;

      // Construct message for failed records
      const failedMessage = failed
        .map(
          (item) => `${item.staff_id} - ${item.name}, Reason: ${item.reason}`
        )
        .join("<br><hr>");

      // Combine both messages
      const detailedMessage = `
        <strong>Total selection(s): </strong>${
          created?.length + failed?.length || "0"
        }<br><br>
        <strong>Successfully created: </strong>${created?.length || "0"}<br><br>
        <strong>Failed Records: </strong>${failed?.length}<br>${
        failedMessage || "None"
      }
      `;

      Swal.fire({
        title: message,
        html: detailedMessage, // Use html to display the formatted message
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
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}
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
            type="date"
            id="overtime_date"
            value={values.overtime_date}
            onChange={handleChange}
            className={`${styles.input}`}
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
                  employeeList
                    .filter((employee) => employee.wage_type !== "established")
                    .map((employee: any) => employee.id)
                );
              } else {
                setEmployeesIDS(
                  selectedOptions.filter(
                    (employeeId) =>
                      employeeId !== "" &&
                      employeeList.some(
                        (employee) =>
                          employee.id === employeeId &&
                          employee.wage_type !== "established"
                      )
                  )
                );
              }
            }}
          >
            <Option value="">Select All</Option>
            {employeeList &&
              employeeList.length > 0 &&
              employeeList
                .filter((employee) => employee.wage_type !== "established")
                .map((employee: any, i: number) => (
                  <Option
                    key={i}
                    value={employee.id}
                    label={`${employee.staff_id} - ${employee.firstname} ${employee.lastname}`}
                  >
                    {employee.staff_id} - {employee.firstname}{" "}
                    {employee.lastname}
                  </Option>
                ))}
          </Select>
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

export default AdminRequestOvertime;
