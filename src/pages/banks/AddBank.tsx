import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useBankStoreMutation } from "../../redux/features/bank/bankApi";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { Drawer } from "antd";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter bank name"),
  code: Yup.string(),
});

interface AddBankProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddBank = ({ open, onClose, refetch }: AddBankProps) => {
  const [bankStore, { data, isSuccess, isLoading, error }] =
    useBankStoreMutation();
  const formik = useFormik({
    initialValues: { name: "", code: "" },
    validationSchema: schema,
    onSubmit: async ({ name, code }) => {
      await bankStore({ name, code });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

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
          onClose();
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
    <Drawer
      title="Add Bank"
      onClose={onClose}
      open={open}
      width={900}
      maskClosable={false}
    >
      <div className="fade-in">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/epa-logo.png" alt="EPA Logo" className="h-12" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Bank Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Bank Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor="code" className={`${styles.label}`}>
            Bank Code
          </label>
          <input
            type="text"
            id="code"
            value={values.code}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Bank Code"
          />
          {errors.code && touched.code && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.code}
            </span>
          )}
        </div>
        <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
          <button type="submit" className={`${styles.small_btn} `} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
        <br />
        </form>
      </div>
    </Drawer>
  );
};

export default AddBank;
