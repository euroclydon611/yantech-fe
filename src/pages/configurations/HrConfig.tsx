import { useFormik } from "formik";
import Swal from "sweetalert2";
import PageLayout from "../../components/PageLayout";
import {
  useDefaultLeaveDaysQuery,
  useHoursPerDayQuery,
  useDefaultLeaveDaysUpdateMutation,
  useHoursPerDayUpdateMutation,
  useDaysPerMonthQuery,
  useDaysPerMonthUpdateMutation,
  usePensionAgeQuery,
  usePensionAgeUpdateMutation,
} from "../../redux/features/configurations/hours_and_leave";
import * as Yup from "yup";
import { styles } from "../../styles";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Schema for validation
const leaveDaysSchema = Yup.object({
  defaultLeaveDays: Yup.number()
    .required("Leave leave days required")
    .min(0, "Allowable leave days cannot be less than 0"),
});

const hoursPerDaySchema = Yup.object({
  hoursPerDay: Yup.number()
    .required("Hours per day required")
    .min(0, "Hours per day cannot be less than 0"),
});

const daysPerMonthSchema = Yup.object({
  daysPerMonth: Yup.number()
    .required("Total payroll days per month required")
    .min(0, "Total payroll days per month cannot be less than 0"),
});

const pensionAgeSchema = Yup.object({
  pensionAge: Yup.number()
    .required("Pension age required")
    .min(0, "Pension age cannot be less than 0"),
});

const HrConfig = () => {
  const { privileges } = useSelector((state: RootState) => state.auth);
  const hasPayrollConfigAccess = privileges?.includes("PAYROLL_CONFIGURATION");
  const hasLeaveConfigAccess = privileges?.includes("HR_LEAVE_CONFIGURATION");

  // Fetch the configuration data
  const { data: defaultLeaveDaysResponse } = useDefaultLeaveDaysQuery({});
  const { data: hoursPerDayResponse } = useHoursPerDayQuery({});
  const { data: daysPerMonthResponse } = useDaysPerMonthQuery({});
  const { data: pensionAgeResponse } = usePensionAgeQuery({});

  const [updateHoursPerDay] = useHoursPerDayUpdateMutation();
  const [updateDefaultLeaveDays] = useDefaultLeaveDaysUpdateMutation();
  const [updateDaysPerMonth] = useDaysPerMonthUpdateMutation();
  const [updatePensionAge] = usePensionAgeUpdateMutation();

  // Formik for Leave Days Configuration
  const leaveDaysFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      defaultLeaveDays: (defaultLeaveDaysResponse?.data as string) || 20,
    },
    validationSchema: leaveDaysSchema,
    onSubmit: async ({ defaultLeaveDays }) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to update the allowable leave days to ${defaultLeaveDays}? This will affect the employees' allowable leave days and remaining leave balance.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateDefaultLeaveDays({ data: defaultLeaveDays });
            Swal.fire(
              "Success!",
              "Leave days updated successfully!",
              "success"
            );
          } catch (error) {
            Swal.fire("Error!", "Failed to update leave days.", "error");
          }
        }
      });
    },
  });

  // Formik for Hours Per Day Configuration
  const hoursPerDayFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      hoursPerDay: (hoursPerDayResponse?.data as string) || 8,
    },
    validationSchema: hoursPerDaySchema,
    onSubmit: async ({ hoursPerDay }) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to update the hours per day to ${hoursPerDay}? This change will affect payroll calculations and related processes.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateHoursPerDay({ data: hoursPerDay });
            Swal.fire(
              "Success!",
              "Hours per day updated successfully!",
              "success"
            );
          } catch (error) {
            Swal.fire("Error!", "Failed to update hours per day.", "error");
          }
        }
      });
    },
  });

  // Formik for Hours Per Day Configuration
  const daysPerMonthFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      daysPerMonth: (daysPerMonthResponse?.data as string) || 20,
    },
    validationSchema: daysPerMonthSchema,
    onSubmit: async ({ daysPerMonth }) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to update the total payroll days to ${daysPerMonth}? This change will affect payroll calculations and related processes.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updateDaysPerMonth({ data: daysPerMonth });
            Swal.fire(
              "Success!",
              "Payroll days updated successfully!",
              "success"
            );
          } catch (error) {
            Swal.fire("Error!", "Failed to update payroll days.", "error");
          }
        }
      });
    },
  });

  // Formik for Pension Age Configuration
  const pensionAgeFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pensionAge: (pensionAgeResponse?.data as string) || 60,
    },
    validationSchema: pensionAgeSchema,
    onSubmit: async ({ pensionAge }) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to update the pension age to ${pensionAge}? This will affect when employees are automatically marked as 'Retired'.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#727cf5",
        cancelButtonColor: "#6b6a66",
        confirmButtonText: "Yes, update it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updatePensionAge({ data: pensionAge });
            Swal.fire(
              "Success!",
              "Pension age updated successfully!",
              "success"
            );
          } catch (error) {
            Swal.fire("Error!", "Failed to update pension age.", "error");
          }
        }
      });
    },
  });

  return (
    <>
      <PageLayout
        title="HR Configuration"
        subtitle="Basic leave, hours, and pension settings"
        breadcrumbs={[{ label: "HR MGT" }, { label: "Configuration" }]}
      />
      <div className="p-4 space-y-4">
      {/* Form for Hours Per Day Configuration */}
      <form onSubmit={daysPerMonthFormik.handleSubmit} className="mb-6">
        <h2 className="text-[16px] mb-2 font-semibold">
          Payroll Days in Month
        </h2>
        <div className="mb-4">
          <input
            type="number"
            id="daysPerMonth"
            name="daysPerMonth"
            className="border p-2 w-full"
            value={daysPerMonthFormik.values.daysPerMonth}
            onChange={daysPerMonthFormik.handleChange}
            onBlur={daysPerMonthFormik.handleBlur}
            disabled={!hasPayrollConfigAccess}
          />
          {daysPerMonthFormik.touched.daysPerMonth &&
          daysPerMonthFormik.errors.daysPerMonth ? (
            <div className="text-red-500">
              {daysPerMonthFormik.errors.daysPerMonth}
            </div>
          ) : null}
        </div>
        {hasPayrollConfigAccess && (
          <button type="submit" className={`${styles.primary_button}`}>
            Save Changes
          </button>
        )}
      </form>

      {/* Form for Leave Days Configuration */}
      <form onSubmit={leaveDaysFormik.handleSubmit} className="mb-6">
        <h2 className="text-[16px] mb-2 font-semibold">Allowable Leave Days</h2>
        <div className="mb-4">
          <input
            type="number"
            id="defaultLeaveDays"
            name="defaultLeaveDays"
            className="border p-2 w-full"
            value={leaveDaysFormik.values.defaultLeaveDays}
            onChange={leaveDaysFormik.handleChange}
            onBlur={leaveDaysFormik.handleBlur}
            disabled={!hasLeaveConfigAccess}
          />
          {leaveDaysFormik.touched.defaultLeaveDays &&
          leaveDaysFormik.errors.defaultLeaveDays ? (
            <div className="text-red-500">
              {leaveDaysFormik.errors.defaultLeaveDays}
            </div>
          ) : null}
        </div>
        {hasLeaveConfigAccess && (
          <button type="submit" className={`${styles.primary_button}`}>
            Save Changes
          </button>
        )}
      </form>

      {/* Form for Hours Per Day Configuration */}
      <form onSubmit={hoursPerDayFormik.handleSubmit}>
        <h2 className="text-[16px] mb-2 font-semibold">Hours Per Day</h2>
        <div className="mb-4">
          <input
            type="number"
            id="hoursPerDay"
            name="hoursPerDay"
            className="border p-2 w-full"
            value={hoursPerDayFormik.values.hoursPerDay}
            onChange={hoursPerDayFormik.handleChange}
            onBlur={hoursPerDayFormik.handleBlur}
            disabled={!hasPayrollConfigAccess}
          />
          {hoursPerDayFormik.touched.hoursPerDay &&
          hoursPerDayFormik.errors.hoursPerDay ? (
            <div className="text-red-500">
              {hoursPerDayFormik.errors.hoursPerDay}
            </div>
          ) : null}
        </div>
        {hasPayrollConfigAccess && (
          <button type="submit" className={`${styles.primary_button}`}>
            Save Changes
          </button>
        )}
      </form>

      {/* Form for Pension Age Configuration */}
      <form onSubmit={pensionAgeFormik.handleSubmit} className="mt-6">
        <h2 className="text-[16px] mb-2 font-semibold">Pension Age</h2>
        <div className="mb-4">
          <input
            type="number"
            id="pensionAge"
            name="pensionAge"
            className="border p-2 w-full"
            value={pensionAgeFormik.values.pensionAge}
            onChange={pensionAgeFormik.handleChange}
            onBlur={pensionAgeFormik.handleBlur}
            disabled={!hasPayrollConfigAccess}
          />
          {pensionAgeFormik.touched.pensionAge &&
          pensionAgeFormik.errors.pensionAge ? (
            <div className="text-red-500">
              {pensionAgeFormik.errors.pensionAge}
            </div>
          ) : null}
        </div>
        {hasPayrollConfigAccess && (
          <button type="submit" className={`${styles.primary_button}`}>
            Save Changes
          </button>
        )}
      </form>
      </div>
    </>
  );
};

export default HrConfig;
