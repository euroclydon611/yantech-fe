import { styles } from "../../../styles";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useStatusUpdateMutation } from "../../../redux/features/configurations/statusApi";
useStatusUpdateMutation;

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter department name"),
});

const EditStatus = ({ setOpen, itemData, refetch }: any) => {
  const [statusUpdate, { data, isSuccess, error, isLoading }] =
    useStatusUpdateMutation();

  const formik = useFormik({
    initialValues: { name: itemData?.name as string },
    validationSchema: schema,
    onSubmit: async ({ name }) => {
      await statusUpdate({ idToEdit: itemData._id, name });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Successful!";
      toast.success(message, { duration: 5000 });
      refetch();
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.error, { duration: 5000 });
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
            Staus Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Status Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
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

export default EditStatus;
