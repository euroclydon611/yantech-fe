import { useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEmployeeVerifyOTPResetMutation } from "../../redux/features/employee-portal-api/authApi";
import Swal from "sweetalert2";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const schema = Yup.object().shape({
  staff_id: Yup.string().required("Staff ID is required"),
  otp: Yup.string().required("OTP is required"),
  new_password: Yup.string().required("Password is required").min(8),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), ""], "Passwords must match!")
    .required("Confirm password is required!"),
});

const EmployeeSetNewPassword = () => {
  PageTitle("Reset Password");
  const navigate = useNavigate();
  const activation_staff_id = localStorage.getItem("activation_staff_id");

  const [verifyOTP, { data, isLoading, isSuccess, error }] =
    useEmployeeVerifyOTPResetMutation();

  const formik = useFormik({
    initialValues: {
      staff_id: activation_staff_id || "",
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ staff_id, otp, new_password }) => {
      await verifyOTP({ staff_id, otp, new_password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Verified";
      Swal.fire({
        title: message,
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#059669",
        showConfirmButton: true,
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "#ffffff",
        customClass: {
          popup: "backdrop-blur-lg border border-white/20 rounded-2xl",
          title: "text-white font-bold",
          htmlContainer: "text-slate-300",
        },
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/employee");
        }
      });
      localStorage.removeItem("activation_staff_id");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Oops...",
          text: errorData?.data?.error || errorData?.data?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#059669",
          showConfirmButton: true,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "#ffffff",
          customClass: {
            popup: "backdrop-blur-lg border border-white/20 rounded-2xl",
            title: "text-white font-bold",
            htmlContainer: "text-slate-300",
          },
        });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const fieldClass = (hasError: boolean) =>
    `w-full h-11 px-4 rounded-xl bg-slate-700 border-2 text-white placeholder-slate-400 outline-none transition-all duration-200 text-sm ${
      hasError
        ? "border-red-400"
        : "border-slate-600 hover:border-green-600 focus:border-green-500"
    }`;

  const ErrorMsg = ({ msg }: { msg: string }) => (
    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 animate-fadeIn">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0c1a11] overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-green-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-700/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 px-4 text-center animate-fadeIn">
        <div className="flex flex-col items-center gap-2">
          <img src="/images/epa-logo.png" alt="EPA Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight uppercase">
              Environmental Protection Authority
            </h1>
            <p className="text-green-400 text-[11px] font-semibold tracking-widest uppercase mt-0.5">
              IPMS — Staff Portal
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="relative z-10 flex justify-center px-4 pb-2 animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-green-800 flex items-center justify-center text-green-400 text-[10px] font-bold">✓</div>
            <span className="text-slate-500 text-[11px]">Request OTP</span>
          </div>
          <div className="w-6 h-px bg-green-700" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">2</div>
            <span className="text-green-400 text-[11px] font-semibold">Verify &amp; Reset</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-md animate-slideUp">
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reset Password</h2>
            <p className="text-slate-400 text-sm mt-1.5">Enter the OTP and set your new password</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl shadow-black/50">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Staff ID */}
              <div>
                <label htmlFor="staff_id" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Staff ID
                </label>
                <input
                  type="text"
                  name="staff_id"
                  id="staff_id"
                  value={values.staff_id}
                  onChange={handleChange}
                  placeholder="Enter your staff ID"
                  className={fieldClass(!!(errors.staff_id && touched.staff_id))}
                />
                {errors.staff_id && touched.staff_id && <ErrorMsg msg={errors.staff_id} />}
              </div>

              {/* OTP */}
              <div>
                <label htmlFor="otp" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={values.otp}
                  onChange={handleChange}
                  placeholder="· · · · · ·"
                  maxLength={6}
                  className={`w-full h-14 px-4 rounded-xl bg-slate-700 border-2 text-white placeholder-slate-500 outline-none transition-all duration-200 text-center text-2xl tracking-[0.5em] font-mono ${
                    errors.otp && touched.otp
                      ? "border-red-400"
                      : "border-slate-600 hover:border-green-600 focus:border-green-500"
                  }`}
                />
                {errors.otp && touched.otp && <ErrorMsg msg={errors.otp} />}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new_password" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <Input.Password
                  id="new_password"
                  name="new_password"
                  size="large"
                  placeholder="Enter new password"
                  value={values.new_password}
                  onChange={handleChange}
                  className={`!rounded-xl !bg-slate-700 !border-2 [&_input]:!text-white [&_input]:!bg-transparent [&_input]:!placeholder-slate-400 transition-all duration-200 ${
                    errors.new_password && touched.new_password
                      ? "!border-red-400"
                      : "!border-slate-600 hover:!border-green-600 focus-within:!border-green-500"
                  }`}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone twoToneColor="#4ade80" /> : <EyeInvisibleOutlined className="text-slate-300" />
                  }
                />
                {errors.new_password && touched.new_password && <ErrorMsg msg={errors.new_password} />}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Confirm New Password
                </label>
                <Input.Password
                  id="confirm_password"
                  name="confirm_password"
                  size="large"
                  placeholder="Confirm new password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  className={`!rounded-xl !bg-slate-700 !border-2 [&_input]:!text-white [&_input]:!bg-transparent [&_input]:!placeholder-slate-400 transition-all duration-200 ${
                    errors.confirm_password && touched.confirm_password
                      ? "!border-red-400"
                      : "!border-slate-600 hover:!border-green-600 focus-within:!border-green-500"
                  }`}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone twoToneColor="#4ade80" /> : <EyeInvisibleOutlined className="text-slate-300" />
                  }
                />
                {errors.confirm_password && touched.confirm_password && <ErrorMsg msg={errors.confirm_password} />}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <Link
                  to="/employee"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 group"
                >
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>

          {/* Security notice */}
          <div className="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 animate-fadeIn">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-slate-300 text-xs font-bold tracking-wider uppercase mb-1">Password Reset Security</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Enter the OTP from your email and set a strong new password. Minimum 8 characters with letters, numbers, and symbols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-5 text-center px-4">
        <p className="text-slate-600 text-[11px] font-bold tracking-widest uppercase">
          © {new Date().getFullYear()} Environmental Protection Authority · Republic of Ghana
        </p>
        <p className="text-slate-700 text-[10px] tracking-widest uppercase mt-1">Powered byDelovely Company Limited</p>
      </div>
    </div>
  );
};

export default EmployeeSetNewPassword;
