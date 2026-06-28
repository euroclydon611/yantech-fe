import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useUnitStoreMutation } from "../../../redux/features/sections/units";
import { useDepartmentFullListQuery } from "../../../redux/features/sections/departmentApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter unit name"),
  department: Yup.string().required("Please select department"),
});

const AddUnit = ({ setOpen, refetch }: any) => {
  const [unitStore, { data, isSuccess, isLoading, error }] =
    useUnitStoreMutation();

  const { data: departmentList } = useDepartmentFullListQuery({});

  const formik = useFormik({
    initialValues: { name: "", department: "" },
    validationSchema: schema,
    onSubmit: async ({ name, department }) => {
      await unitStore({ name, department_id: department });
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
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Unit Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Unit Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="department" className={`${styles.label}`}>
            Select Department
          </label>
          <select
            name="department"
            id="department"
            value={values.department}
            onChange={handleChange}
            className={`${styles.input}`}
          >
            <option value="">------</option>
            {departmentList &&
              departmentList.data !== null &&
              departmentList.data.map((department: any, i: number) => (
                <option key={i} value={department.id}>
                  {department.name}
                </option>
              ))}
          </select>
          {errors.department && touched.department && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.department}
            </span>
          )}
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

export default AddUnit;
