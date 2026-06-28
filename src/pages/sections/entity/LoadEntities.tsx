import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useLoadEntitiesDataMutation } from "../../../redux/features/sections/entityApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  doc: Yup.mixed()
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
            value.type === "text/csv")
        );
      }
    ),
});

const LoadEntities = ({ setOpen, refetch }: any) => {
  const [loadEntitiesData, { data, isSuccess, isLoading, error }] =
    useLoadEntitiesDataMutation();

  const formik = useFormik({
    initialValues: { doc: null },
    validationSchema: schema,
    onSubmit: async (values) => {
      await loadEntitiesData(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Data Import Completed";

      const { canceled, inserted, totalRows, data: failed } = data;

      // Construct message for failed records
      const failedMessage = failed
        ?.map(
          (item: any) =>
            `${item["Management Unit"] || "Unknown Entity"} - ${item["ERROR"] || item["error"] || "Unknown Error"}`
        )
        .join("<br><hr>");

      const outcome = `
      Total Rows: ${totalRows}<br><br>
      Inserted: ${inserted}<br><br>
      <strong>Failed Records: </strong>${canceled}<br>${failedMessage || "None"}
    `;

      Swal.fire({
        title: message,
        icon: "success",
        html: outcome,
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

  const { errors, touched, setFieldValue, handleSubmit } = formik;

  return (
    <div className="fade-in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="doc" className={`${styles.label}`}>
            Select XLSX or CSV
          </label>
          <input
            type="file"
            id="doc"
            onChange={(event: any) => {
              setFieldValue("doc", event.currentTarget.files[0]);
            }}
            accept=".xlsx, .csv, .xls"
            className={`w-full text-[14px] bg-transparent border rounded  text-[#6c757d] px-2 py-[6px] outline-none mt-[4px]`}
          />
          {errors.doc && touched.doc && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.doc as string}
            </span>
          )}
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button
            type="submit"
            className={`${styles.small_btn} `}
            disabled={isLoading}
          >
            {isLoading ? "Importing" : "Import"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default LoadEntities;
