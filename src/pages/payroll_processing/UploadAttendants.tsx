import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLoadEmployeesWorkedHoursMutation } from "../../redux/features/reports/payrollRun";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  // monthYear: Yup.string().required("Please select month"),
  hourly_doc: Yup.mixed()
    .required("Please select a file")
    .test(
      "fileFormat",
      "Unsupported file format. Please select a .xlsx or .csv file",
      (value: any) => {
        if (!value) return true;
        return (
          value &&
          (value.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            value.type === "text/csv" ||
            value.type === "application/vnd.ms-excel")
        );
      }
    ),
});

const getCurrentMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const UploadAttendants = ({ setOpen, refetch }: any) => {
  const [loadEmployeesWorkedHours, { data, isSuccess, isLoading, error }] =
    useLoadEmployeesWorkedHoursMutation();

  const formik = useFormik({
    initialValues: { hourly_doc: null, monthYear: getCurrentMonth() },
    validationSchema: schema,
    onSubmit: async ({ hourly_doc }) => {
      await loadEmployeesWorkedHours({ year, month, hourly_doc });
    },
  });

  // useEffect(() => {
  //   if (isSuccess) {
  //     const message =
  //       `${data?.message ? data?.message : "Completed"}` || "Completed!";

  //     const invalid_ids = data?.invalid_ids;

  //     Swal.fire({
  //       title: message,
  //       icon: "success",
  //       html: `
  //       <p>Some employee records could not be processed due to invalid or unrecognized IDs.</p>
  //       <p><strong>Invalid IDs:</strong> ${invalid_ids.join(", ")}</p>
  //       <p>Please ensure the employees are properly registered and try again.</p>
  //     `,
  //       timer: 5000,
  //       confirmButtonColor: "#727cf5",
  //       showConfirmButton: true,
  //     }).then((result) => {
  //       if (result.isConfirmed || result.isDismissed) {
  //         refetch();
  //         setOpen(false);
  //       }
  //     });
  //   }
  //   if (error) {
  //     if ("data" in error) {
  //       const errorData = error as any;
  //       Swal.fire({
  //         title: "Oops...",
  //         text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
  //         icon: "error",
  //         // timer: 5000,
  //         confirmButtonColor: "#727cf5",
  //         showConfirmButton: true,
  //       });
  //     }
  //   }
  // }, [isSuccess, error]);

  useEffect(() => {
    if (isSuccess) {
      // Get the message from the data or set a default one
      const message = data?.message || "Processing Complete!";

      // Get the invalid IDs (assuming only invalid IDs are returned if any exist)
      const invalid_ids = data?.invalid_ids || [];

      // Build the HTML message based on whether there are invalid IDs
      const invalidIdsMessage =
        invalid_ids.length > 0
          ? `
        <p>Some employee records could not be processed due to invalid or unrecognized IDs.</p>
        <p><strong>Invalid IDs:</strong> ${invalid_ids.join(", ")}</p>
        <p>The rest of the employee records have been processed successfully.</p>
        <p>Please ensure the invalid employees are properly registered and try again.</p>
        `
          : `<p>All employee records have been successfully processed.</p>`;

      Swal.fire({
        title: message,
        icon: invalid_ids.length > 0 ? "warning" : "success", // Warning if invalid IDs exist
        html: invalidIdsMessage,
        // timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          refetch(); // Optionally refetch the data
          setOpen(false); // Close the modal or form
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
  }, [isSuccess, error, data, refetch, setOpen]);

  const { errors, touched, values, setFieldValue, handleChange, handleSubmit } =
    formik;

  const monthYear = values.monthYear.split("-");
  const year = monthYear[0];
  const monthNo = monthYear[1];
  let month: string;

  if (monthNo == "01") {
    month = "January";
  }
  if (monthNo == "02") {
    month = "February";
  }
  if (monthNo == "03") {
    month = "March";
  }
  if (monthNo == "04") {
    month = "April";
  }
  if (monthNo == "05") {
    month = "May";
  }
  if (monthNo == "06") {
    month = "June";
  }
  if (monthNo == "07") {
    month = "July";
  }
  if (monthNo == "08") {
    month = "August";
  }
  if (monthNo == "09") {
    month = "September";
  }
  if (monthNo == "10") {
    month = "October";
  }
  if (monthNo == "11") {
    month = "November";
  }
  if (monthNo == "12") {
    month = "December";
  }

  return (
    <div className="fade-in">
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* <div>
          <label htmlFor="month">Month</label>
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
        </div> */}
        <div>
          <label htmlFor="doc" className={`${styles.label}`}>
            Select XLSX or CSV
          </label>
          <input
            type="file"
            id="hourly_doc"
            onChange={(event: any) => {
              setFieldValue("hourly_doc", event.currentTarget.files[0]);
            }}
            accept=".xlsx, .csv, .xls"
            className={`w-full text-[14px] bg-transparent border rounded  text-[#6c757d] px-2 py-[6px] outline-none mt-[4px]`}
          />
          {errors.hourly_doc && touched.hourly_doc && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.hourly_doc as string}
            </span>
          )}
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `}>
            {isLoading ? "Loading..." : "Load"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default UploadAttendants;
