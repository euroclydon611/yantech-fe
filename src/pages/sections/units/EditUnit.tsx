import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useUnitUpdateMutation } from "../../../redux/features/sections/units";
import { useDepartmentFullListQuery } from "../../../redux/features/sections/departmentApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter unit name"),
  department: Yup.string().required("Please select department"),
});

const EditUnit = ({ setOpen, itemData, refetch }: any) => {
  console.log("unit item", itemData);
  const [unitUpdate, { data, isSuccess, error, isLoading }] =
    useUnitUpdateMutation();

  const { data: departmentList } = useDepartmentFullListQuery({});

  const formik = useFormik({
    initialValues: {
      name: itemData?.name as string,
      department: itemData.department_id as string,
    },
    validationSchema: schema,
    onSubmit: async ({ name, department }) => {
      console.log("Form data", name, department);
      await unitUpdate({
        idToEdit: itemData?._id,
        name,
        department_id: department,
      });
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

  console.log(values.department);

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
            {/* <option value={itemData?.department_id}>
              {itemData?.department[0]?.name}
            </option> */}
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

export default EditUnit;
