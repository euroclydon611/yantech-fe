import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateServiceCodeMutation } from "../../redux/features/configurations/service_codes";
import { useEffect } from "react";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter service code name"),
  service_code: Yup.string().required("Please enter service code"),
  status: Yup.string().oneOf(["active", "inactive"]).required(),
});

const AddServiceCode = ({ setOpen, refetch }: any) => {
  const [createServiceCode, { data, isSuccess, isLoading, error }] =
    useCreateServiceCodeMutation();
  const formik = useFormik({
    initialValues: { name: "", service_code: "", status: "active" },
    validationSchema: schema,
    onSubmit: async ({ name, service_code, status }) => {
      await createServiceCode({ name, service_code, status });
    },
  });

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
          // timer: 5000,
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="fade-in">
      {/* <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div> */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Service Code Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Service Code Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="service_code" className={`${styles.label}`}>
            Service Code
          </label>
          <input
            type="text"
            id="service_code"
            value={values.service_code}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Service Code"
          />
          {errors.service_code && touched.service_code && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.service_code}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="status" className={`${styles.label}`}>
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={handleChange}
            className={`${styles.input}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default AddServiceCode;
