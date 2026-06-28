import { useEffect } from "react";
import { styles } from "../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import Swal from "sweetalert2";
import {
  useEmployeeLogoutMutation,
  useEmployeeChangePasswordMutation,
} from "../redux/features/employee-portal-api/authApi";

const schema = Yup.object().shape({
  old_password: Yup.string().required("Old password is required").min(8),
  new_password: Yup.string().required("Password is required").min(8),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), ""], "Passwords must match!")
    .required("Confirm password is required!"),
});

const ChangePassword = () => {
  const [logout] = useEmployeeLogoutMutation();

  const navigate = useNavigate();

  const [changePassword, { data, isLoading, isSuccess, error }] =
    useEmployeeChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ old_password, new_password }) => {
      await changePassword({ old_password, new_password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Password Changed";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          logout({});
          navigate("/employee");
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
    <>
      <div className="bg-white flex flex-col gap-2 items-center justify-center py-12 sm:px-6 lg:px-4 shadow-sm">
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          <img src="/images/epa-logo.png" alt="" className="w-[103px]" />
        </div> */}

        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
          <p className="text-xl text-[#000] font-semibold">
            Change Your Password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="w-full mb-3">
            <label htmlFor="password" className={`${styles.label} !mb-4`}>
              Old Password
            </label>
            <Input.Password
              id="old_password"
              name="old_password"
              className={`${styles.input}`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
              placeholder="Enter Old Password"
              iconRender={(visible: any) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={values.old_password}
              onChange={handleChange}
            />
            {errors.old_password && touched.old_password && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.old_password}
              </span>
            )}
          </div>
          <div className="w-full mb-3">
            <label htmlFor="password" className={`${styles.label} !mb-4`}>
              New Password
            </label>
            <Input.Password
              id="new_password"
              name="new_password"
              className={`${styles.input}`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
              placeholder="Enter New  Password"
              iconRender={(visible: any) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={values.new_password}
              onChange={handleChange}
            />
            {errors.new_password && touched.new_password && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.new_password}
              </span>
            )}
          </div>
          <div className="w-full mb-3">
            <label htmlFor="password" className={`${styles.label} !mb-4`}>
              Confirm New Password
            </label>
            <Input.Password
              id="confirm_password"
              name="confirm_password"
              className={`${styles.input}`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.75)" }}
              placeholder="Confirm New Password"
              iconRender={(visible: any) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={values.confirm_password}
              onChange={handleChange}
            />
            {errors.confirm_password && touched.confirm_password && (
              <span className="text-red-500 pt-2 block fade-in">
                {errors.confirm_password}
              </span>
            )}
          </div>

          <div className="w-full mt-5">
            <input
              type="submit"
              value={`${isLoading ? " Please wait..." : "Change Password"}`}
              disabled={isLoading}
              className={`${styles.button}`}
            />
          </div>
          <br />
        </form>
      </div>
    </>
  );
};
export default ChangePassword;
