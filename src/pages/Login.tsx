import { useEffect } from "react";
import { PageTitle } from "../utils/PageTitle";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/features/auth/authApi";
import Swal from "sweetalert2";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login = () => {
  PageTitle("Login | YANTEC Engineering ERP");
  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const message = `${data?.message}` || "Login Successful!";
      toast.success(message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        Swal.fire({
          title: "Access Denied",
          text:
            errorData?.data?.error ||
            errorData?.data?.message ||
            "Invalid credentials. Please try again.",
          icon: "error",
          confirmButtonColor: "#006B3F",
          showConfirmButton: true,
        });
      }
    }
  }, [isSuccess, error, data, navigate]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="flex min-h-screen font-sans overflow-hidden">

      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #0D2244 55%, #0A1628 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }} />
          <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #1A3A6B 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }} />
        </div>

        {/* Logo + Brand */}
        <div className="z-10 flex items-center gap-3">
          <img src="/images/logo.png" alt="YANTEC Engineering" className="h-10 object-contain" />
        </div>

        {/* Centre hero text */}
        <div className="z-10 flex-1 flex flex-col justify-center gap-6 py-12">
          <img src="/images/logo.png" alt="YANTEC Engineering" className="w-32 object-contain" />

          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-white mb-2">
              YANTEC<br />Engineering<br /><span style={{ color: "#F5A623" }}>Limited</span>
            </h1>
            <p className="text-sm font-semibold tracking-[0.25em] uppercase" style={{ color: "#F5A623" }}>
              Enterprise Resource Planning
            </p>
          </div>

          {/* Brand stripe */}
          <div className="flex gap-1.5 w-24 mt-1">
            <div className="h-1 flex-1 rounded-full" style={{ background: "#F5A623" }} />
            <div className="h-1 flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
            <div className="h-1 flex-1 rounded-full" style={{ background: "#1A3A6B" }} />
          </div>

          <p className="text-sm text-white/50 leading-relaxed max-w-xs mt-2">
            Delivering reliable electrical engineering solutions and automation services with a commitment to safety, innovation, and customer satisfaction.
          </p>
        </div>

        {/* Footer */}
        <div className="z-10 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F5A623" }}>
              YANTEC Engineering Ltd
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/35">Official Portal</span>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-2" style={{ color: "rgba(245,166,35,0.75)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#F5A623" }} />
            Strictly for authorized personnel only
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div
        className="w-full lg:w-[54%] flex flex-col items-center justify-center p-6 md:p-14 relative"
        style={{ background: "#f8f9fb" }}
      >
        {/* Mobile brand bar */}
        <div
          className="lg:hidden w-full flex items-center gap-3 mb-8 px-2 pb-6"
          style={{ borderBottom: "1px solid rgba(13,27,16,0.08)" }}
        >
          <img src="/images/logo.png" alt="YANTEC" className="h-9 object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "#0A1628" }}>
              YANTEC Engineering
            </span>
            <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: "#F5A623" }}>
              Enterprise Resource Planning
            </span>
          </div>
        </div>

        <div className="max-w-[420px] w-full">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(13,27,16,0.08)] border border-gray-100/80 p-8 md:p-10">

            {/* Card header */}
            <div className="flex items-start gap-3.5 mb-8">
              <div className="w-1 h-10 rounded-full mt-0.5 flex-shrink-0" style={{ background: "#D4A017" }} />
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-xs mt-1.5 font-medium">
                  Sign in to the YANTEC Engineering ERP
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="your.name@yantecengineering.com"
                  className={`w-full px-4 py-3.5 rounded-xl border bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-300 ${
                    errors.email && touched.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/10"
                  }`}
                />
                {errors.email && touched.email && (
                  <span className="text-red-500 text-[10px] mt-1.5 block font-bold uppercase tracking-wider">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]"
                  >
                    Password
                  </label>
                  <Link
                    to="/user/password-reset/request-otp"
                    className="text-[11px] font-bold transition-colors"
                    style={{ color: "#F5A623" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input.Password
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className={`w-full !px-4 !py-3.5 !rounded-xl !bg-gray-50 !text-sm !font-medium !transition-all ${
                    errors.password && touched.password ? "!border-red-400" : "!border-gray-200"
                  }`}
                  iconRender={(visible: any) =>
                    visible ? (
                      <EyeTwoTone twoToneColor="#F5A623" />
                    ) : (
                      <EyeInvisibleOutlined className="!text-gray-300" />
                    )
                  }
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <span className="text-red-500 text-[10px] mt-1.5 block font-bold uppercase tracking-wider">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 uppercase tracking-[0.18em] text-[11px] mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isLoading
                    ? "#b8791a"
                    : "linear-gradient(135deg, #0A1628 0%, #0D2244 50%, #1A3A6B 100%)",
                  boxShadow: "0 8px 24px rgba(10,22,40,0.35)",
                }}
              >
                {isLoading ? "Signing in…" : "Sign In"}
              </button>

              {/* Links */}
              <div className="pt-5 border-t border-gray-50 flex items-center justify-center gap-5">
                <Link
                  to="/user/activate-account"
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                >
                  Activate Account
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <Link
                  to="/employee"
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
                >
                  Staff Portal
                </Link>
              </div>
            </form>
          </div>

          {/* Below card */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-gray-300 font-bold tracking-[0.15em] uppercase">
              © {new Date().getFullYear()} YANTEC Engineering Limited · All Rights Reserved
            </p>
            <div className="flex justify-center gap-4 text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em]">
              <span>YEL Portal</span>
              <span className="text-gray-200">•</span>
              <span>Takoradi, Ghana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
