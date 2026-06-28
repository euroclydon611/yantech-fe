import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageTitle } from "../../utils/PageTitle";
import { usePayrollRunMutation } from "../../redux/features/reports/payrollRun";
import Loader from "../../components/Loader";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

// Validation Schema
const schema = Yup.object().shape({
  monthYear: Yup.string().required("Payroll Period is required"),
  remaining_days_in_month: Yup.number()
    .required("Prorated Days Adjustment for Payroll Period is required")
    .min(0, "Prorated Days Adjustment cannot be less than 0"),

  // payroll_start_date: Yup.date().optional().typeError("Invalid date format"),
  payroll_start_date: Yup.date()
    .nullable()
    .typeError("Invalid date format")
    .test(
      "valid-start-date",
      "Start date can only be from the previous month of the payroll period",
      function (value) {
        const { monthYear } = this.parent;
        if (!monthYear) return true;
        const payrollMonth = moment(monthYear, "YYYY-MM");
        const previousMonth = payrollMonth.clone().subtract(1, "months");
        return (
          !value ||
          (value >= previousMonth.startOf("month").toDate() &&
            value <= previousMonth.endOf("month").toDate())
        );
      }
    ),

  payroll_end_date: Yup.date()
    .required("Payroll end date is required")
    .typeError("Invalid date format")
    .test(
      "valid-end-date",
      "End date can only be within the payroll month",
      function (value) {
        const { monthYear } = this.parent;
        if (!monthYear) return false;
        const payrollMonth = moment(monthYear, "YYYY-MM");
        return (
          !value ||
          (value >= payrollMonth.startOf("month").toDate() &&
            value <= payrollMonth.endOf("month").toDate())
        );
      }
    )
    .test(
      "end-after-start",
      "End date cannot be earlier than the start date",
      function (value) {
        const { payroll_start_date } = this.parent;
        return !payroll_start_date || !value || value >= payroll_start_date;
      }
    ),
});

// Get Current Month
const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PayrollRunOld = () => {
  PageTitle("Payroll Run | Payroll");
  const navigate = useNavigate();
  const [isAttendanceOn, setIsAttendanceOn] = useState(true);

  const toggleAttendance = useCallback(() => {
    setIsAttendanceOn((prevState) => !prevState);
  }, []);

  const use_hourly = isAttendanceOn ? 1 : 0;

  const [payrollRun, { data, isLoading, isSuccess, error }] =
    usePayrollRunMutation();

  const formik = useFormik({
    initialValues: {
      monthYear: getCurrentMonth(),
      payroll_start_date: "",
      payroll_end_date: "",
      remaining_days_in_month: 0,
    },
    validationSchema: schema,
    onSubmit: async (formValues) => {
      const [year, monthNo] = formValues.monthYear.split("-");
      const pay_month = monthNames[parseInt(monthNo) - 1];

      await payrollRun({
        year,
        pay_month,
        remaining_days_in_month: formValues.remaining_days_in_month,
        payroll_start_date: formValues.payroll_start_date,
        payroll_end_date: formValues.payroll_end_date,
      });
    },
  });

  const { errors, touched, values, handleChange, handleBlur, handleSubmit } =
    formik;

  // Handle success or failure
  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Successful!";
      Swal.fire({
        title: message,
        icon: "success",
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/payroll-test-run");
          window.location.reload();
        }
      });
      localStorage.setItem("year", values.monthYear.split("-")[0]);
      localStorage.setItem(
        "pay_month",
        monthNames[parseInt(values.monthYear.split("-")[1]) - 1]
      );
      localStorage.setItem("forecast", "1");
      localStorage.setItem("dash_forecast", "1");
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
  }, [isSuccess, error, data, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="pt-4 px-2">
      <h1 className="text-[18px] mb-3 font-medium">Payroll Run</h1>
      <div className="p-4">
        <div className="flex flex-col gap-2 mb-2 max-w-[490px] mx-auto bg-white rounded-sm">
          <h1 className="py-[12px] px-[14px] border-b w-full">
            Run Payroll for
          </h1>
          <form
            className="py-[12px] px-[14px] flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="monthYear" className={styles.label}>
                Choose Month <span className="text-[red]">*</span>
              </label>
              <input
                type="month"
                id="monthYear"
                className={`${styles.input} text-[#6c757d]`}
                value={values.monthYear}
                onChange={handleChange}
              />
              {errors.monthYear && touched.monthYear && (
                <span className="text-red-500 pt-2 block fade-in">
                  {errors.monthYear}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="payroll_start_date" className={styles.label}>
                Payroll Start Date
              </label>
              <input
                type="date"
                id="payroll_start_date"
                className={`${styles.input} text-[#6c757d]  ${
                  errors.payroll_start_date &&
                  touched.payroll_start_date &&
                  "border-red-500"
                }`}
                value={values.payroll_start_date}
                onChange={handleChange}
              />
              {errors.payroll_start_date && touched.payroll_start_date && (
                <span className="text-red-500 pt-2 block fade-in">
                  {errors.payroll_start_date}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="payroll_end_date" className={styles.label}>
                Payroll End Date <span className="text-[red]">*</span>
              </label>
              <input
                type="date"
                id="payroll_end_date"
                className={`${styles.input} text-[#6c757d] ${
                  errors.payroll_end_date &&
                  touched.payroll_end_date &&
                  "border-red-500"
                }`}
                value={values.payroll_end_date}
                onChange={handleChange}
              />
              {errors.payroll_end_date && touched.payroll_end_date && (
                <span className="text-red-500 pt-2 block fade-in">
                  {errors.payroll_end_date}
                </span>
              )}
            </div>
            <div className="hidden">
              <label htmlFor="remaining_days_in_month" className={styles.label}>
                Prorated Days Adjustment
              </label>
              <input
                type="number"
                id="remaining_days_in_month"
                name="remaining_days_in_month"
                className={`${styles.input} text-[#6c757d]`}
                placeholder="Prorated Days Adjustment for Payroll Period"
                value={values.remaining_days_in_month}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.remaining_days_in_month &&
                errors.remaining_days_in_month && (
                  <div className="text-red-500">
                    {errors.remaining_days_in_month}
                  </div>
                )}
            </div>
            <div className="flex justify-center">
              <button className={`${styles.primary_button} text-lg`}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayrollRunOld;

