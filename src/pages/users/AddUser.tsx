import { styles } from "../../styles";
import { Select, Drawer, Collapse, Checkbox, Divider } from "antd";
const { Panel } = Collapse;
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useMemo } from "react";
import {
  useUserPrivilegesQuery,
  useUserStoreMutation,
} from "../../redux/features/users/userApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  firstname: Yup.string().required("Please enter first name"),
  lastname: Yup.string().required("Please enter last name"),
  other_names: Yup.string(),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  phone: Yup.string().required("Phone number is required!"),
  type: Yup.string().required("Please select user type"),
});

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddUser = ({ open, onClose, refetch }: AddUserProps) => {
  const [privilege_ids, setPrivilege_ids] = useState<string[]>([]);

  const { data: userPrivileges } = useUserPrivilegesQuery(
    {
      sortField: "name",
      sortOrder: "asc",
    },
    { skip: !open }
  );

  const groupedPrivileges = useMemo(() => {
    if (!userPrivileges?.data) return {};
    return userPrivileges.data.reduce((acc: any, privilege: any) => {
      const category = privilege.name.split("_")[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(privilege);
      return acc;
    }, {});
  }, [userPrivileges]);

  const [userStore, { data, isSuccess, isLoading, error, reset }] =
    useUserStoreMutation();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      other_names: "",
      lastname: "",
      email: "",
      // password: "",
      phone: "",
      type: "",
    },
    validationSchema: schema,
    onSubmit: async ({
      firstname,
      lastname,
      other_names,
      email,
      phone,
      // password,
      type,
    }) => {
      await userStore({
        firstname,
        lastname,
        other_names,
        email,
        phone,
        // password,
        type,
        privilege_ids,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setPrivilege_ids([]);
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess && open) {
      const message = `${data?.message}` || "Completed";
      reset(); // Reset mutation state immediately
      Swal.fire({
        title: message,
        icon: "success",
        timer: 3000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        refetch();
        onClose();
      });
    }
    if (error && open) {
      if ("data" in error) {
        const errorData = error as any;
        reset(); // Reset mutation state
        Swal.fire({
          title: "Oops...",
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#727cf5",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, data, refetch, onClose, reset, open]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const handleTogglePrivilege = (id: string) => {
    setPrivilege_ids((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAllCategory = (category: string, checked: boolean) => {
    const categoryIds = groupedPrivileges[category].map((p: any) => p._id);
    if (checked) {
      setPrivilege_ids((prev) =>
        Array.from(new Set([...prev, ...categoryIds]))
      );
    } else {
      setPrivilege_ids((prev) =>
        prev.filter((id) => !categoryIds.includes(id))
      );
    }
  };

  return (
    <Drawer
      title="Add New User"
      onClose={onClose}
      open={open}
      width={1000}
      maskClosable={false}
    >
      <div className="fade-in">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className={`${styles.label}`}>
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                value={values.firstname}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Enter First Name"
              />
              {errors.firstname && touched.firstname && (
                <span className="text-red-500 pt-1 text-xs block fade-in">
                  {errors.firstname}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="lastname" className={`${styles.label}`}>
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={values.lastname}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Enter Last Name "
              />
              {errors.lastname && touched.lastname && (
                <span className="text-red-500 pt-1 text-xs block fade-in">
                  {errors.lastname}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="other_names" className={`${styles.label}`}>
                Other Name
              </label>
              <input
                type="text"
                id="other_names"
                value={values.other_names}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Enter Other Name "
              />
            </div>
            <div>
              <label htmlFor="email" className={`${styles.label}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="example@gmail.com "
              />
              {errors.email && touched.email && (
                <span className="text-red-500 pt-1 text-xs block fade-in">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className={`${styles.label}`}>
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                value={values.phone}
                onChange={handleChange}
                className={`${styles.input}`}
                maxLength={16}
                placeholder="Enter Phone Number"
              />
              {errors.phone && touched.phone && (
                <span className="text-red-500 pt-1 text-xs block fade-in">
                  {errors.phone}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="level" className={`${styles.label}`}>
                Select Role
              </label>
              <select
                name="type"
                id="type"
                value={values.type}
                onChange={handleChange}
                className={`${styles.input}`}
              >
                <option value="">------</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
                <option value="CHIEF EXECUTIVE OFFICER">CEO / MD</option>
                <option value="FINANCIAL CONTROLLER">
                  FINANCIAL CONTROLLER
                </option>
              </select>
              {errors.type && touched.type && (
                <span className="text-red-500 pt-1 text-xs block fade-in">
                  {errors.type}
                </span>
              )}
            </div>
          </div>

          <Divider orientation="left" style={{ margin: "12px 0" }}>
            User Privileges
          </Divider>

          <div className="max-h-[500px] overflow-y-auto pr-2">
            <Collapse ghost defaultActiveKey={["HR", "PAYROLL", "SETTINGS"]}>
              {Object.keys(groupedPrivileges).map((category) => (
                <Panel
                  header={
                    <div className="flex justify-between items-center w-full pr-4">
                      <span className="font-bold text-green-800">
                        {category} MODULE
                      </span>
                      <Checkbox
                        indeterminate={
                          groupedPrivileges[category].some((p: any) =>
                            privilege_ids.includes(p._id)
                          ) &&
                          !groupedPrivileges[category].every((p: any) =>
                            privilege_ids.includes(p._id)
                          )
                        }
                        checked={groupedPrivileges[category].every((p: any) =>
                          privilege_ids.includes(p._id)
                        )}
                        onChange={(e) =>
                          handleSelectAllCategory(category, e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        Select All
                      </Checkbox>
                    </div>
                  }
                  key={category}
                >
                  <div className="columns-3 gap-x-8 pl-4 space-y-2">
                    {groupedPrivileges[category].map((privilege: any) => (
                      <div
                        key={privilege._id}
                        className="break-inside-avoid mb-2 flex items-center"
                      >
                        <Checkbox
                          checked={privilege_ids.includes(privilege._id)}
                          onChange={() => handleTogglePrivilege(privilege._id)}
                          className="text-xs"
                        >
                          {privilege.name
                            .replace(`${category}_`, "")
                            .replace(/_/g, " ")
                            .toUpperCase()}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>

          <div className="w-full text-center mt-6 flex justify-center item-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.primary_button} w-full`}
            >
              {isLoading ? "Processing..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default AddUser;
