import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageTitle } from "../../utils/PageTitle";
import PageLayout from "../../components/PageLayout";
import { usePayrollRunMutation } from "../../redux/features/reports/payrollRun";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usePrivileges } from "../../hooks/usePrivileges";

// Validation Schema
const schema = Yup.object().shape({
  monthYear: Yup.string().required("Payroll Period is required"),
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

const Payroll_run = () => {
  PageTitle("Payroll Run | Payroll");
  const navigate = useNavigate();

  const { hasPayrollRunViewAccess, hasPayrollRunCreateAccess } = usePrivileges();

  if (!hasPayrollRunViewAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-xl font-medium text-red-500">
          You are not authorized to view this page.
        </h1>
      </div>
    );
  }

  const [payrollRun, { data, isLoading, isSuccess, error }] =
    usePayrollRunMutation();

  const formik = useFormik({
    initialValues: {
      monthYear: getCurrentMonth(),
    },
    validationSchema: schema,
    onSubmit: async (formValues) => {
      const [year, monthNo] = formValues.monthYear.split("-");
      const pay_month = monthNames[parseInt(monthNo) - 1];

      await payrollRun({
        year,
        pay_month,
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
    <>
      <PageLayout
        title="Payroll Run"
        subtitle="Execute payroll for a selected month"
        breadcrumbs={[{ label: "Payroll" }, { label: "Processing" }, { label: "Payroll Run" }]}
      />
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
            <div className="flex justify-center">
              {hasPayrollRunCreateAccess && (
                <button
                  className={`${styles.primary_button} text-lg`}
                  disabled={!hasPayrollRunCreateAccess}
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payroll_run;