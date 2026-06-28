import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useEntityFullListQuery,
  useEntityStoreMutation,
} from "../../../redux/features/sections/entityApi";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Select, Drawer } from "antd";
const { Option } = Select;

const schema = Yup.object().shape({
  name: Yup.string().required("Entity name is required"),
  designation: Yup.string().required("Designation is required"),
  branch_code: Yup.string(),
  officeLocation: Yup.string(),
});

interface AddEntityProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddEntity = ({ open, onClose, refetch }: AddEntityProps) => {
  const [reporting_entity_id, setSetReporting_entity_id] = useState("");

  const [entityStore, { data, isSuccess, isLoading, error }] =
    useEntityStoreMutation();
  const formik = useFormik({
    initialValues: {
      name: "",
      designation: "",
      branch_code: "",
      officeLocation: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, designation, branch_code, officeLocation }) => {
      if (!reporting_entity_id || reporting_entity_id.trim() === "") {
        Swal.fire({
          icon: "warning",
          title: "Missing Field",
          text: "Reporting Entity is mandatory.",
        });
        return;
      }
      await entityStore({
        name,
        designation,
        branch_code,
        reporting_entity_id: reporting_entity_id,
        officeLocation: officeLocation || undefined,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSetReporting_entity_id("");
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
          formik.resetForm();
          onClose();
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
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error]);

  const { data: entityFullList } = useEntityFullListQuery(
    {
      designation: "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <Drawer
      title="Add Entity"
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
            <label htmlFor="designation" className={`${styles.label}`}>
              Designation
            </label>
            <select
              id="designation"
              value={values.designation}
              onChange={handleChange}
              className={`${styles.input}`}
            >
              <option value="">- - - - - -</option>
              <option value="division">Division</option>
              <option value="department">Department</option>
              <option value="unit">Unit</option>
            </select>
            {errors.designation && touched.designation && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.designation}
              </span>
            )}
          </div>

          {values.designation == "division" && (
            <div>
              <label htmlFor="level" className={`${styles.label}`}>
                Reporting Entity (Default: CEO Secretariat)
              </label>
              <Select
                showSearch
                optionFilterProp="label"
                id="reporting_entity_id"
                style={{ width: "100%" }}
                placeholder="Choose..."
                value={reporting_entity_id}
                onChange={(selectedValue) =>
                  setSetReporting_entity_id(selectedValue)
                }
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
                // disabled
                // onSearch={(searchValue) => setSearchTerm(searchValue)}
              >
                <Option value="">- - - - -</Option>
                {entityFullList?.data &&
                  entityFullList?.data.length > 0 &&
                  entityFullList.data
                    .filter(
                      (entity: any) =>
                        entity.name !== values.name &&
                        !["unit", "department", "division"].includes(
                          entity.designation
                        )
                    )
                    .map((entity: any, i: number) => (
                      <Option
                        key={i}
                        value={entity.id}
                        label={`${entity.name}`}
                      >
                        {`${entity.name} - (${entity.designation})`}
                      </Option>
                    ))}
              </Select>
            </div>
          )}

          {values.designation == "department" && (
            <div>
              <label htmlFor="level" className={`${styles.label}`}>
                Reporting Entity
              </label>
              <Select
                showSearch
                optionFilterProp="label"
                id="reporting_entity_id"
                style={{ width: "100%" }}
                placeholder="Choose..."
                value={reporting_entity_id}
                onChange={(selectedValue) =>
                  setSetReporting_entity_id(selectedValue)
                }
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
                // onSearch={(searchValue) => setSearchTerm(searchValue)}
              >
                <Option value="">- - - - -</Option>
                {entityFullList?.data &&
                  entityFullList?.data.length > 0 &&
                  entityFullList.data
                    .filter(
                      (entity: any) =>
                        entity.name !== values.name &&
                        !["unit", "department"].includes(entity.designation)
                    )
                    .map((entity: any, i: number) => (
                      <Option
                        key={i}
                        value={entity.id}
                        label={`${entity.name}`}
                      >
                        {`${entity.name} - (${entity.designation})`}
                      </Option>
                    ))}
              </Select>
            </div>
          )}

          {values.designation == "unit" && (
            <div>
              <label htmlFor="level" className={`${styles.label}`}>
                Reporting Entity
              </label>
              <Select
                showSearch
                optionFilterProp="label"
                id="reporting_entity_id"
                style={{ width: "100%" }}
                placeholder="Choose..."
                value={reporting_entity_id}
                onChange={(selectedValue) =>
                  setSetReporting_entity_id(selectedValue)
                }
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
                // onSearch={(searchValue) => setSearchTerm(searchValue)}
              >
                <Option value="">- - - - -</Option>
                {entityFullList?.data &&
                  entityFullList?.data.length > 0 &&
                  entityFullList.data
                    .filter(
                      (entity: any) =>
                        entity.name !== values.name &&
                        !["unit"].includes(entity.designation)
                    )
                    .map((entity: any, i: number) => (
                      <Option
                        key={i}
                        value={entity.id}
                        label={`${entity.name}`}
                      >
                        {`${entity.name} - (${entity.designation})`}
                      </Option>
                    ))}
              </Select>
            </div>
          )}

          <div>
            <label htmlFor="name" className={`${styles.label}`}>
              Entity Name
            </label>
            <input
              type="text"
              id="name"
              value={values.name}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Entity Name"
            />
            {errors.name && touched.name && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="branch_code" className={`${styles.label}`}>
              Branch Code
            </label>
            <input
              type="text"
              id="branch_code"
              value={values.branch_code}
              onChange={handleChange}
              className={`${styles.input}`}
              placeholder="Enter Branch Code"
            />
            {errors.branch_code && touched.branch_code && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.branch_code}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="officeLocation" className={`${styles.label}`}>
              Office Location Type
            </label>
            <select
              id="officeLocation"
              value={values.officeLocation}
              onChange={handleChange}
              className={`${styles.input}`}
            >
              <option value="">- - Select Location Type - -</option>
              <option value="headquarters">Head Quarters</option>
              <option value="region">Region</option>
              <option value="district">District</option>
              <option value="area">Area</option>
            </select>
            {errors.officeLocation && touched.officeLocation && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.officeLocation}
              </span>
            )}
          </div>

          <div className="w-full text-center mt-5 flex justify-center item-center text-[14px]">
            <button
              type="submit"
              className={`${styles.small_btn}`}
              disabled={isLoading}
            >
              {isLoading ? "Please wait" : "Submit"}
            </button>
          </div>
          <br />
        </form>
      </div>
    </Drawer>
  );
};

export default AddEntity;
