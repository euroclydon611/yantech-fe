import { useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { styles } from "../../styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useUserVerifyOTPMutation } from "../../redux/features/users/userApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  otp: Yup.string().required("OTP is required"),
});

const Verify_otp = () => {
  PageTitle("Verify OTP | User Activation");
  const navigate = useNavigate();
  const activation_email = localStorage.getItem("activation_email");

  const [verifyOTP, { data, isLoading, isSuccess, error }] =
    useUserVerifyOTPMutation();

  const formik = useFormik({
    initialValues: { email: activation_email || "", otp: "" },
    validationSchema: schema,
    onSubmit: async ({ email, otp }) => {
      await verifyOTP({ email, otp });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Verified";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#727cf5",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/user/set-password");
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
          <p className="text-xl text-[#000] font-semibold">Verify OTP</p>
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

              <div className="w-full mb-3">
                <label htmlFor="email" className={`${styles.label}`}>
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={values.otp}
                  onChange={handleChange}
                  id="otp"
                  placeholder="Enter OTP"
                  className={`${
                    errors.otp && touched.otp && "border-red-500 fade-in"
                  } ${styles.input}`}
                />
                {errors.otp && touched.otp && (
                  <span className="text-red-500 pt-2 block fade-in">
                    {errors.otp}
                  </span>
                )}
              </div>
              <div className="w-full mt-5">
                <input
                  type="submit"
                  value="Verify OTP"
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

export default Verify_otp;
