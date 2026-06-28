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
  name: Yup.string().required("Qualification is required"),
});

const AddTrainings = ({ setOpen, data, refetch }: any) => {
  // const [updateInfo, { data: updatedData, isSuccess, isLoading, error }] =
  //   useEmployeeInfoUpdateMutation();

  const [employeeUpdate, { data: updatedData, isSuccess, isLoading, error }] =
    useEmployeeUpdateMutation();

  const existingTrainings = data?.trainings;

  const formik = useFormik({
    initialValues: {
      name: "",
      body: "",
      certification: "",
      start_date: "",
      end_date: "",
    },
    validationSchema: schema,
    onSubmit: async () => {
      const resident_format =
        data?.gra_resident == "non_resident" ? false : true;
      await employeeUpdate({
        ...data,
        gra_resident: resident_format,
        trainings: [...existingTrainings, values],
      });
    },
    // onSubmit: async (values) => {
    //   const payload = {
    //     trainings: [...existingTrainings, values],
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
  }, [isSuccess, error, updatedData]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="fade-in text-[#000000E6]">
      <div className="flex items-center justify-center fade-in">
        <img src="/images/epa-logo.png" alt="" />
      </div>
      <br />
      <h3 className="font-bold text-xl text-center">
        Add Training Qualification
      </h3>
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
            placeholder="Ex: Project Management"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Body
          </label>
          <input
            type="text"
            id="body"
            value={values.body}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="The Organization"
          />
        </div>

        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Certification
          </label>
          <input
            type="text"
            id="certification"
            value={values.certification}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Ex: Agile Certified Practitioner (PMI-ACP)."
          />
        </div>

        <div className="flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="fromDate" className={`${styles.label}`}>
              Start date
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={values.start_date}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className="w-[45%]">
            <label htmlFor="toDate" className={`${styles.label} `}>
              End date
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={values.end_date}
              onChange={handleChange}
              className={`${styles.input}`}
            />
          </div>
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

export default AddTrainings;
