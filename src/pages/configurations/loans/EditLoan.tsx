import { styles } from "../../../styles";
import { Select, Drawer } from "antd";
const { Option } = Select;
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import {
  useUpdateEmployeeLoanMutation,
} from "../../../redux/features/configurations/employeeLoanApi";
import { useEmployeeFullListQuery } from "../../../redux/features/employee/employeeApi";
import { useGetFullLenderListQuery } from "../../../redux/features/configurations/lenderApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  employee_id: Yup.string().required("Employee is required"),
  lender_id: Yup.string().required("Lender is required"),
  original_amount: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0)
    .default(0),
  monthly_deduction: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0)
    .default(0),
  outstanding_balance: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0)
    .default(0),
  start_month: Yup.string().required("Start month is required"),
  start_year: Yup.number().required("Start year is required"),
});

interface EditLoanProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  itemData: any;
}

const EditLoan = ({ open, onClose, refetch, itemData }: EditLoanProps) => {
  const [updateLoan, { isSuccess, isLoading, error, data }] = useUpdateEmployeeLoanMutation();
  const { data: employeeList } = useEmployeeFullListQuery({}, { skip: !open });
  const { data: lenderList } = useGetFullLenderListQuery({}, { skip: !open });

  const formik = useFormik({
    initialValues: {
      employee_id: "",
      lender_id: "",
      original_amount: 0,
      monthly_deduction: 0,
      outstanding_balance: 0,
      start_month: "",
      start_year: new Date().getFullYear(),
      remarks: "",
      status: "active",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await updateLoan({ id: itemData._id, data: values });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (itemData) {
      formik.setValues({
        employee_id: itemData.employee_id?._id || itemData.employee_id,
        lender_id: itemData.lender_id?._id || itemData.lender_id,
        original_amount: itemData.original_amount,
        monthly_deduction: itemData.monthly_deduction,
        outstanding_balance: itemData.outstanding_balance,
        start_month: itemData.start_month,
        start_year: itemData.start_year,
        remarks: itemData.remarks || "",
        status: itemData.status,
      });
    }
  }, [itemData]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: data?.message || "Loan updated successfully",
        icon: "success",
        confirmButtonColor: "#727cf5",
      }).then(() => {
        refetch();
        onClose();
      });
    }
    if (error) {
      const errorData = error as any;
      const errorMessage = errorData?.data?.message || errorData?.data?.error || errorData?.message || "Failed to update loan";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#727cf5",
      });
    }
  }, [isSuccess, error]);

  return (
    <Drawer
      title="Edit Employee Loan"
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
            status={formik.errors.employee_id && formik.touched.employee_id ? "error" : ""}
          >
            {employeeList?.map((emp: any) => (
              <Option key={emp.id} value={emp.id} label={`${emp.staff_id} - ${emp.firstname} ${emp.lastname}`}>
                {emp.staff_id} - {emp.firstname} {emp.lastname}
              </Option>
            ))}
          </Select>
          {formik.errors.employee_id && formik.touched.employee_id && (
            <span className="text-red-500 text-[11px] mt-1">{formik.errors.employee_id}</span>
          )}
        </div>

        <div>
          <label className={`${styles.label}`}>Select Lender</label>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Choose lender..."
            optionFilterProp="label"
            value={formik.values.lender_id || undefined}
            onChange={(val) => formik.setFieldValue("lender_id", val)}
            status={formik.errors.lender_id && formik.touched.lender_id ? "error" : ""}
          >
            {lenderList?.data?.map((lender: any) => (
              <Option key={lender._id} value={lender._id} label={lender.name}>
                {lender.name} {lender.code ? `(${lender.code})` : ""}
              </Option>
            ))}
          </Select>
          {formik.errors.lender_id && formik.touched.lender_id && (
            <span className="text-red-500 text-[11px] mt-1">{formik.errors.lender_id}</span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={`${styles.label}`}>Original Amount</label>
            <input
              type="number"
              name="original_amount"
              value={formik.values.original_amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${formik.errors.original_amount && formik.touched.original_amount ? "border-red-500" : ""}`}
            />
            {formik.errors.original_amount && formik.touched.original_amount && (
              <span className="text-red-500 text-[11px] mt-1">{formik.errors.original_amount}</span>
            )}
          </div>
          <div className="flex-1">
            <label className={`${styles.label}`}>Monthly Deduction</label>
            <input
              type="number"
              name="monthly_deduction"
              value={formik.values.monthly_deduction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${formik.errors.monthly_deduction && formik.touched.monthly_deduction ? "border-red-500" : ""}`}
            />
            {formik.errors.monthly_deduction && formik.touched.monthly_deduction && (
              <span className="text-red-500 text-[11px] mt-1">{formik.errors.monthly_deduction}</span>
            )}
          </div>
        </div>

        <div>
          <label className={`${styles.label}`}>Outstanding Balance</label>
          <input
            type="number"
            name="outstanding_balance"
            value={formik.values.outstanding_balance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.input} ${formik.errors.outstanding_balance && formik.touched.outstanding_balance ? "border-red-500" : ""}`}
          />
          {formik.errors.outstanding_balance && formik.touched.outstanding_balance && (
            <span className="text-red-500 text-[11px] mt-1">{formik.errors.outstanding_balance}</span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={`${styles.label}`}>Start Month</label>
            <select
              name="start_month"
              value={formik.values.start_month}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${formik.errors.start_month && formik.touched.start_month ? "border-red-500" : ""}`}
            >
              <option value="">Select Month</option>
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                <option key={m} value={m.toLowerCase()}>{m}</option>
              ))}
            </select>
            {formik.errors.start_month && formik.touched.start_month && (
              <span className="text-red-500 text-[11px] mt-1">{formik.errors.start_month}</span>
            )}
          </div>
          <div className="flex-1">
            <label className={`${styles.label}`}>Start Year</label>
            <input
              type="number"
              name="start_year"
              value={formik.values.start_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${styles.input} ${formik.errors.start_year && formik.touched.start_year ? "border-red-500" : ""}`}
            />
            {formik.errors.start_year && formik.touched.start_year && (
              <span className="text-red-500 text-[11px] mt-1">{formik.errors.start_year}</span>
            )}
          </div>
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
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className={`${styles.label}`}>Remarks</label>
          <textarea
            name="remarks"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            className={`${styles.input} h-20`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.primary_button} w-full mt-4 !h-[42px]`}
        >
          {isLoading ? "Updating..." : "Update Loan"}
        </button>
      </form>
    </Drawer>
  );
};

export default EditLoan;
