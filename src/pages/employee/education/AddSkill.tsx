import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  useEmployeeInfoUpdateMutation,
  useEmployeeUpdateMutation,
} from "../../../redux/features/employee/employeeApi";
const schema = Yup.object().shape({
  proficiency_level: Yup.string().required("Proficiency level is required"),
  name: Yup.string().required("Qualification is required"),
});

const AddSkill = ({ setOpen, data, refetch }: any) => {
  // const [updateInfo, { data: updatedData, isSuccess, isLoading, error }] =
  //   useEmployeeInfoUpdateMutation();

  const [employeeUpdate, { data: updatedData, isSuccess, isLoading, error }] =
    useEmployeeUpdateMutation();

  const existingSkills = data?.special_skills;
  const formik = useFormik({
    initialValues: {
      name: "",
      proficiency_level: "",
    },
    validationSchema: schema,
    onSubmit: async () => {
      const resident_format =
        data?.gra_resident == "non_resident" ? false : true;
      await employeeUpdate({
        ...data,
        gra_resident: resident_format,
        special_skills: [...existingSkills, values],
      });
    },

    // onSubmit: async (values) => {
    //   const payload = {
    //     special_skills: [...existingSkills, values],
    //   };

    //   await updateInfo(payload);
    // },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${updatedData?.message}` || "Completed";
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
    <div className="fade-in text-[#000000E6]">
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <br />
      <h3 className="font-bold text-xl text-center">Add Skill</h3>
      <br />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Name
            <span className="text-red-600 font-bold text-lg">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Ex: Data Analysis"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="proficiency_level" className={`${styles.label}`}>
            Proficiency level
            <span className="text-red-600 font-bold text-lg">*</span>
          </label>
          <input
            type="text"
            id="proficiency_level"
            value={values.proficiency_level}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Ex: Intermediate"
          />
          {errors.proficiency_level && touched.proficiency_level && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.proficiency_level}
            </span>
          )}
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
      </form>
    </div>
  );
};

export default AddSkill;
