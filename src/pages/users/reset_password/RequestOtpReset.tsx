import { useEffect } from "react";
import { PageTitle } from "../../../utils/PageTitle";
import { styles } from "../../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useUserRequestOTPResetMutation } from "../../../redux/features/users/userApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
});

const RequestOtpReset = () => {
  PageTitle("Rest Password");
  const navigate = useNavigate();

  const [requestOTP, { data, isLoading, isSuccess, error }] =
    useUserRequestOTPResetMutation();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async ({ email }) => {
      await requestOTP({ email });
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
          navigate("/user/password-reset/verify-otp-set-password");
        }
      });
      localStorage.setItem("activation_email", values.email);
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="min-h-[80vh] bg-gray-50 flex flex-col gap-2 items-center justify-center py-12 sm:px-6 lg:px-4 shadow-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          <img src="/images/epa-logo.png" alt="" className="w-[103px]" />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center items-center">
          <p className="text-xl text-[#000] font-semibold">
            Request OTP to Reset Your Password
          </p>
        </div>

        <div className="mx-auto sm:mx-auto sm:w-full sm:max-w-md max-sm:w-[80%]">
          <div className="bg-white py-6 px-3 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div className="w-full mb-3">
                <label htmlFor="email" className={`${styles.label}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  id="email"
                  placeholder="Enter your email"
                  className={`${
                    errors.email && touched.email && "border-red-500 fade-in"
                  } ${styles.input}`}
                />
                {errors.email && touched.email && (
                  <span className="text-red-500 pt-2 block fade-in">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="w-full mt-5">
                <input
                  type="submit"
                  value="Request OTP"
                  className={`${styles.button}`}
                />
              </div>
              <br />
            </form>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-center m-[3px]">
        © 2024, Calculus Solutions Limited
      </p>
    </>
  );
};

export default RequestOtpReset;
