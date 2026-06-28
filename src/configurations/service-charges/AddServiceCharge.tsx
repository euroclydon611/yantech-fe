import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateServiceChargeMutation } from "../../redux/features/configurations/service_charges";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { Checkbox } from "antd";

const schema = Yup.object().shape({
  min_amount: Yup.number().required("Please enter minimum amount").min(0),
  max_amount: Yup.number().nullable().moreThan(Yup.ref('min_amount'), "Max amount must be greater than min amount"),
  charge: Yup.number().required("Please enter charge amount").min(0),
  is_cap: Yup.boolean(),
});

const AddServiceCharge = ({ setOpen, refetch }: any) => {
  const [createServiceCharge, { data, isSuccess, isLoading, error }] =
    useCreateServiceChargeMutation();
  const formik = useFormik({
    initialValues: { min_amount: 0, max_amount: null, charge: 0, is_cap: false },
    validationSchema: schema,
    onSubmit: async (values) => {
      await createServiceCharge(values);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#14532D",
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
          confirmButtonColor: "#14532D",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, data, refetch, setOpen]);

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } = formik;

  return (
    <div className="fade-in p-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min_amount" className={`${styles.label}`}>
              Min Amount (GHS)
            </label>
            <input
              type="number"
              id="min_amount"
              value={values.min_amount}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Min Amount"
            />
            {errors.min_amount && touched.min_amount && (
              <span className="text-red-500 pt-2 block text-xs">
                {errors.min_amount as any}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="max_amount" className={`${styles.label}`}>
              Max Amount (GHS)
            </label>
            <input
              type="number"
              id="max_amount"
              value={values.max_amount || ""}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Max Amount (Leave empty for above)"
            />
            {errors.max_amount && touched.max_amount && (
              <span className="text-red-500 pt-2 block text-xs">
                {errors.max_amount as any}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="charge" className={`${styles.label}`}>
            Charge Amount (GHS)
          </label>
          <input
            type="number"
            id="charge"
            value={values.charge}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Charge Amount"
          />
          {errors.charge && touched.charge && (
            <span className="text-red-500 pt-2 block text-xs">
              {errors.charge as any}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox 
            id="is_cap" 
            checked={values.is_cap} 
            onChange={(e) => setFieldValue('is_cap', e.target.checked)}
          >
            Is Cap?
          </Checkbox>
        </div>

        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceCharge;
