import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDepartmentUpdateMutation } from "../../../redux/features/sections/departmentApi";
import { useEffect } from "react";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter department name"),
});

const EditDepartment = ({ setOpen, itemData, refetch }: any) => {
  const [departmentUpdate, { data, isSuccess, error, isLoading }] =
    useDepartmentUpdateMutation();

  const formik = useFormik({
    initialValues: { name: itemData?.name as string },
    validationSchema: schema,
    onSubmit: async ({ name }) => {
      await departmentUpdate({ idToEdit: itemData._id, name });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "The department has been updated.";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          setOpen(false);
          refetch();
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

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Department Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Department Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center ">
          <button type="submit" className={`${styles.small_btn}`}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default EditDepartment;
