import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateReportTemplateMutation } from "../../redux/features/configurations/reports_templates";
import { useEffect } from "react";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter template name"),
  description: Yup.string(),
  templateFile: Yup.mixed().required("Please upload a template file"),
});

const AddReportTemplate = ({ setOpen, refetch }: any) => {
  const [createReportTemplate, { data, isSuccess, isLoading, error }] =
    useCreateReportTemplateMutation();

  const formik = useFormik({
    initialValues: { name: "", description: "", templateFile: null },
    validationSchema: schema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.templateFile) {
        formData.append("templateFile", values.templateFile);
      }
      await createReportTemplate(formData);
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
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } = formik;

  return (
    <div className="fade-in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className={`${styles.label}`}>
            Template Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Template Name"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="description" className={`${styles.label}`}>
            Description
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="Enter Description"
            rows={3}
          />
          {errors.description && touched.description && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.description}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="templateFile" className={`${styles.label}`}>
            Template File
          </label>
          <input
            type="file"
            id="templateFile"
            onChange={(event) => {
              setFieldValue("templateFile", event.currentTarget.files?.[0]);
            }}
            className={`${styles.input} h-auto py-2`}
          />
          {errors.templateFile && touched.templateFile && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.templateFile as any}
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
  );
};

export default AddReportTemplate;
