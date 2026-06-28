import { useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Select } from "antd";
import Swal from "sweetalert2";
import { useCreateHsCodeMutation } from "@/redux/features/configurations/hscodes";
import { useFetchHsCodeCategoriesQuery } from "@/redux/features/configurations/hscodes";

const { Option } = Select;

const schema = Yup.object().shape({
  hsCode: Yup.string().required("HS Code is required"),
  name: Yup.string().required("Charge description is required"),
});

const AddHSCode = ({ setOpen, refetch }: any) => {
  PageTitle("Add Code");

  const [createCode, { data, isSuccess, isLoading, error }] =
    useCreateHsCodeMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      hsCode: "",
      categoryId: "",
      assessments: [],
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await createCode({ ...values });
    },
  });

  const { errors, touched, values, setValues, handleChange, handleSubmit } =
    formik;

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}`;
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#2E7D32",
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
          // timer: 5000,
          confirmButtonColor: "#2E7D32",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, data]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Add New HS Code</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">
            Product Description <span className="text-[red]">*</span>
          </label>
          <Input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="Enter Description"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label className="font-medium">
            HS Code <span className="text-[red]">*</span>
          </label>
          <Input
            type="text"
            id="hsCode"
            value={values.hsCode}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="Enter HS Code"
          />
          {errors.hsCode && touched.hsCode && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.hsCode}
            </span>
          )}
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            className={`${styles.small_btn} flex items-center justify-center gap-2 py-2`}
          >
            <span className="font-medium">
              {isLoading ? "Please wait..." : "Submit"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHSCode;
