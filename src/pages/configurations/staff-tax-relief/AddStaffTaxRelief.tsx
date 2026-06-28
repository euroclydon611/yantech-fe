import { styles } from "../../../styles";
import { Select, Drawer } from "antd";
const { Option } = Select;
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import {
  useCreateStaffTaxReliefMutation,
} from "../../../redux/features/configurations/staffTaxReliefApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  employee_id: Yup.string().required("Employee is required"),
  name: Yup.string().required("Relief name is required"),
  amount: Yup.number().required("Amount is required").min(0),
});

interface AddStaffTaxReliefProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddStaffTaxRelief = ({ open, onClose, refetch }: AddStaffTaxReliefProps) => {
  const [createRelief, { isSuccess, isLoading, error, data }] = useCreateStaffTaxReliefMutation();
  const { data: employeeList } = useEmployeeFullListQuery({});

  const formik = useFormik({
    initialValues: {
      employee_id: "",
      name: "",
      amount: "",
      status: "active",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await createRelief(values);
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: data?.message || "Staff tax relief created successfully",
        icon: "success",
        confirmButtonColor: "#727cf5",
      }).then(() => {
        refetch();
        onClose();
        formik.resetForm();
      });
    }
    if (error) {
      const errorData = error as any;
      Swal.fire({
        title: "Error",
        text: errorData?.data?.message || "Failed to create staff tax relief",
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [isSuccess, error]);

  return (
    <Drawer
      title="Add Staff Tax Relief"
      onClose={onClose}
      open={open}
      width={500}
      maskClosable={false}
    >
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div>
          <label className={`${styles.label}`}>Select Employee</label>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Choose employee..."
            optionFilterProp="label"
            value={formik.values.employee_id || undefined}
            onChange={(val) => formik.setFieldValue("employee_id", val)}
          >
            {employeeList?.map((emp: any) => (
              <Option key={emp.id} value={emp.id} label={`${emp.staff_id} - ${emp.firstname} ${emp.lastname}`}>
                {emp.staff_id} - {emp.firstname} {emp.lastname}
              </Option>
            ))}
          </Select>
          {formik.errors.employee_id && formik.touched.employee_id && (
            <span className="text-red-500 text-xs">{formik.errors.employee_id}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Relief Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Disability Relief"
            value={formik.values.name}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          />
          {formik.errors.name && formik.touched.name && (
            <span className="text-red-500 text-xs">{formik.errors.name}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Amount</label>
          <input
            type="number"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          />
          {formik.errors.amount && formik.touched.amount && (
            <span className="text-red-500 text-xs">{formik.errors.amount}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className={`${styles.input}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.primary_button} w-full mt-4 !h-[42px]`}
        >
          {isLoading ? "Saving..." : "Save Relief"}
        </button>
      </form>
    </Drawer>
  );
};

export default AddStaffTaxRelief;
