import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateEntityRoutingMutation } from "../../redux/features/configurations/entity_routing";
import { useEntityFullListQuery } from "../../redux/features/sections/entityApi";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { Select } from "antd";

const schema = Yup.object().shape({
  applicationType: Yup.string().required("Please select application type"),
  applicationCategory: Yup.string().required("Please select application category"),
  permitType: Yup.string().required("Please enter permit type"),
  category: Yup.string(),
  subcategory: Yup.string(),
  sector: Yup.string(),
  entityPattern: Yup.string().required("Please enter entity pattern"),
  entityRegex: Yup.string().required("Please enter entity regex"),
  active: Yup.boolean(),
});

const AddEntityRouting = ({ setOpen, refetch }: any) => {
  const [createEntityRouting, { data, isSuccess, isLoading, error }] =
    useCreateEntityRoutingMutation();
  const { data: entityListData } = useEntityFullListQuery({ designation: "" });

  const handleEntitySelect = (entityName: string) => {
    const normalizedName = entityName.toLowerCase();
    const regexPattern = `/${normalizedName}/i`;
    formik.setFieldValue("entityPattern", normalizedName);
    formik.setFieldValue("entityRegex", regexPattern);
  };

  const formik = useFormik({
    initialValues: {
      applicationType: "",
      applicationCategory: "",
      permitType: "",
      category: "",
      subcategory: "",
      sector: "",
      entityPattern: "",
      entityRegex: "",
      active: true,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await createEntityRouting(values);
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

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } = formik;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("active", e.target.checked);
  };

  return (
    <div className="fade-in">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="applicationType" className={`${styles.label}`}>
            Application Type *
          </label>
          <input
            type="text"
            id="applicationType"
            value={values.applicationType}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., new_application, renewal"
          />
          {errors.applicationType && touched.applicationType && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.applicationType}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="applicationCategory" className={`${styles.label}`}>
            Application Category *
          </label>
          <input
            type="text"
            id="applicationCategory"
            value={values.applicationCategory}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., license, permit"
          />
          {errors.applicationCategory && touched.applicationCategory && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.applicationCategory}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="permitType" className={`${styles.label}`}>
            Permit Type *
          </label>
          <input
            type="text"
            id="permitType"
            value={values.permitType}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., environmental_permit, advertisement"
          />
          {errors.permitType && touched.permitType && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.permitType}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="category" className={`${styles.label}`}>
            Category
          </label>
          <input
            type="text"
            id="category"
            value={values.category}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., energy_sector, health_sector (optional)"
          />
        </div>

        <div>
          <label htmlFor="subcategory" className={`${styles.label}`}>
            Subcategory
          </label>
          <input
            type="text"
            id="subcategory"
            value={values.subcategory}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., petroleum, renewable (optional)"
          />
        </div>

        <div>
          <label htmlFor="sector" className={`${styles.label}`}>
            Sector
          </label>
          <input
            type="text"
            id="sector"
            value={values.sector}
            onChange={handleChange}
            className={`${styles.input}`}
            placeholder="e.g., upstream, downstream (optional)"
          />
        </div>

        <div>
          <label className={`${styles.label}`}>
            Entity Pattern *
          </label>
          <Select
            placeholder="-- Select Entity --"
            value={values.entityPattern || undefined}
            onChange={handleEntitySelect}
            className="w-full"
            showSearch
            filterOption={(input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={entityListData?.data?.map((entity: any) => ({
              label: `${entity.name} (${entity.designation})`,
              value: entity.name,
            })) || []}
          />
          {errors.entityPattern && touched.entityPattern && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.entityPattern}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="entityRegex" className={`${styles.label}`}>
            Entity Regex * <span className="text-gray-500 text-sm">(Auto-generated)</span>
          </label>
          <input
            type="text"
            id="entityRegex"
            value={values.entityRegex}
            readOnly
            className={`${styles.input} bg-gray-100 cursor-not-allowed`}
            placeholder="Will be auto-generated from selected entity"
          />
          {errors.entityRegex && touched.entityRegex && (
            <span className="text-red-500 pt-2 block fade-in">
              {errors.entityRegex}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={values.active}
            onChange={handleCheckboxChange}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="active" className="cursor-pointer">
            Active
          </label>
        </div>

        <div className="mt-6 w-full text-center flex justify-center text-[14px]">
          <button type="submit" className={`${styles.small_btn}`} disabled={isLoading}>
            {isLoading ? "Please wait" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEntityRouting;
