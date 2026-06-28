import { useEffect } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEmployeeRequestOTPResetMutation } from "../../redux/features/employee-portal-api/authApi";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  staff_id: Yup.string().required("Staff ID is required"),
});

const EmployeeRequestOtpReset = () => {
  PageTitle("Reset Password");
  const navigate = useNavigate();

  const [requestOTP, { data, isLoading, isSuccess, error }] =
    useEmployeeRequestOTPResetMutation();

  const formik = useFormik({
    initialValues: { staff_id: "" },
    validationSchema: schema,
    onSubmit: async ({ staff_id }) => {
      await requestOTP({ staff_id });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Completed";
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
          navigate("/employee/password-reset/verify-otp-set-password");
        }
      });
      localStorage.setItem("activation_staff_id", values.staff_id);
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
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">1</div>
            <span className="text-green-400 text-[11px] font-semibold">Request OTP</span>
          </div>
          <div className="w-6 h-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-[10px] font-bold">2</div>
            <span className="text-slate-600 text-[11px]">Verify &amp; Reset</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        <div className="w-full max-w-md animate-slideUp">
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reset Your Password</h2>
            <p className="text-slate-400 text-sm mt-1.5">Enter your Staff ID to receive a password reset OTP</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-2xl shadow-black/50">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className={`w-full h-11 px-4 rounded-xl bg-slate-700 border-2 text-white placeholder-slate-400 outline-none transition-all duration-200 text-sm ${
                    errors.staff_id && touched.staff_id
                      ? "border-red-400"
                      : "border-slate-600 hover:border-green-600 focus:border-green-500"
                  }`}
                />
                {errors.staff_id && touched.staff_id && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 animate-fadeIn">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.staff_id}
                  </p>
                )}
              </div>

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
                      Requesting...
                    </>
                  ) : (
                    "Request OTP"
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

          {/* Info notice */}
          <div className="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 animate-fadeIn">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-slate-300 text-xs font-bold tracking-wider uppercase mb-1">Password Reset Process</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  After submitting your Staff ID, you will receive a one-time password via email or SMS. Check your official inbox.
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

export default EmployeeRequestOtpReset;
