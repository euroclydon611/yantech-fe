import { useState, useEffect } from "react";
import { PageTitle } from "../utils/PageTitle";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEmployeeLoginMutation } from "../redux/features/employee-portal-api/authApi";
import { useSendClientGeoMutation } from "../redux/features/audit/auditApi";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  SecurityScanOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Input, Button, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";

const schema = Yup.object().shape({
  staff_id: Yup.string().required("Staff ID is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const generateFingerprint = (): string => {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.platform,
    navigator.cookieEnabled,
  ].join("|");
  return btoa(raw).slice(0, 32);
};

const useLiveClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};



const Login = () => {
  PageTitle("Staff Portal | YANTEC Engineering ERP");

  const now = useLiveClock();

  const [login, { isSuccess, isLoading, error, data }] =
    useEmployeeLoginMutation();
  const [sendClientGeo] = useSendClientGeoMutation();
  const navigate = useNavigate();
  const [geoModalOpen, setGeoModalOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const sendGeoPayload = async (
    granted: boolean,
    position?: GeolocationPosition,
    deniedReason?: string,
  ) => {
    if (!employeeId) return;
    try {
      await sendClientGeo({
        employeeId,
        latitude: position?.coords.latitude,
        longitude: position?.coords.longitude,
        accuracy: position?.coords.accuracy,
        timestamp: position
          ? new Date(position.timestamp).toISOString()
          : new Date().toISOString(),
        permissionGranted: granted,
        permissionDeniedReason: deniedReason || "",
        fingerprint: generateFingerprint(),
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).unwrap();
    } catch (_) {}
  };

  const handleAllowGeo = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await sendGeoPayload(true, pos);
        setGeoLoading(false);
        setGeoModalOpen(false);
        toast.success("Location verified successfully");
        sessionStorage.setItem("show_manual_prompt", "true");
        navigate("/employee-portal/dashboard");
        window.location.reload();
      },
      async (err) => {
        await sendGeoPayload(false, undefined, err.message);
        setGeoLoading(false);
        setGeoModalOpen(false);
        sessionStorage.setItem("show_manual_prompt", "true");
        navigate("/employee-portal/dashboard");
        window.location.reload();
      },
      { timeout: 10000, maximumAge: 0 },
    );
  };

  const handleSkipGeo = async () => {
    await sendGeoPayload(false, undefined, "User skipped");
    setGeoModalOpen(false);
    sessionStorage.setItem("show_manual_prompt", "true");
    navigate("/employee-portal/dashboard");
    window.location.reload();
  };

  const formik = useFormik({
    initialValues: { staff_id: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ staff_id, password }) => {
      await login({ staff_id, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const successMessage = `${data?.message}` || "Login Successful";
      toast.success(successMessage);
      const emp = data?.data;
      const empId = emp?._id || emp?.id;
      if (empId) {
        setEmployeeId(empId);
        setGeoModalOpen(true);
      } else {
        sessionStorage.setItem("show_manual_prompt", "true");
        navigate("/employee-portal/dashboard");
        window.location.reload();
      }
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(
          errorData.data.error ||
            errorData.data.message ||
            "Login failed. Please try again.",
        );
      }
    }
  }, [isSuccess, error, data, navigate]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;



  return (
    <>
      <Modal
        open={geoModalOpen}
        closable={false}
        footer={null}
        centered
        width={420}
      >
        <div className="text-center p-4">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <EnvironmentOutlined className="text-green-600 text-2xl" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Security Verification
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            For security and fraud prevention purposes, YANTEC Engineering Limited requires
            location verification for authorized staff. Your location is recorded
            only during sensitive actions.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              type="primary"
              size="large"
              loading={geoLoading}
              className="w-full !bg-green-600 hover:!bg-green-700"
              onClick={handleAllowGeo}
            >
              Allow Location Access
            </Button>
            <Button
              size="large"
              className="w-full"
              onClick={handleSkipGeo}
              disabled={geoLoading}
            >
              Continue Without
            </Button>
          </div>
        </div>
      </Modal>

      <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A1628] overflow-hidden">

        {/* ── Left branding panel (desktop only) ── */}
        <div className="hidden lg:flex lg:w-[45%] relative flex-col p-12 overflow-hidden animate-slideInLeft">
          {/* Decorative background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(245,166,35,0.15)" }} />
            <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full blur-[100px]" style={{ background: "rgba(26,58,107,0.3)" }} />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse"
              style={{ background: "rgba(13,34,68,0.4)", animationDuration: "6s" }}
            />
          </div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

          {/* All content vertically centered */}
          <div className="relative z-10 flex-1 flex flex-col justify-center gap-7">
            {/* Logo + brand */}
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="YANTEC Engineering"
                className="h-10 object-contain"
              />
            </div>

            {/* Title block */}
            <div>
              {/* Brand stripe */}
              <div className="flex gap-1.5 w-20 mb-5">
                <div className="h-0.5 flex-1 rounded-full" style={{ background: "#F5A623" }} />
                <div className="h-0.5 flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
                <div className="h-0.5 flex-1 rounded-full" style={{ background: "#1A3A6B" }} />
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-3">
                YANTEC<br /><span style={{ color: "#F5A623" }}>Engineering</span>
              </h1>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#F5A623" }}>
                ERP
              </p>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                Enterprise Resource Planning — Staff Portal
              </p>
            </div>

            {/* Live clock */}
            <div className="border-t border-white/[0.07] pt-4">
              <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                {now.toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {now.toLocaleDateString("en-GH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Footer (left panel only) */}
            <div>
              <p className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">
                © {now.getFullYear()} YANTEC Engineering Limited · Takoradi, Ghana
              </p>
              <p className="text-slate-700 text-[10px] tracking-widest uppercase mt-1">
                Reliable Power Solution · Smart Automation
              </p>
            </div>
          </div>
        </div>

        {/* ── Right panel — warm gold-tinted, staff-focused ── */}
        <div
          className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 md:p-14 relative"
          style={{ background: "linear-gradient(160deg, #f4f7fc 0%, #eef2fb 60%, #f4f7fc 100%)" }}
        >
          {/* Subtle brand blob */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #1A3A6B 0%, transparent 70%)" }} />
          </div>

          {/* Mobile brand bar */}
          <div className="lg:hidden w-full flex items-center gap-3 mb-8 px-2 pb-6 relative z-10"
            style={{ borderBottom: "1px solid rgba(245,166,35,0.25)" }}>
            <img src="/images/logo.png" alt="YANTEC" className="h-9 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "#0A1628" }}>YANTEC Engineering</span>
              <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: "#F5A623" }}>ERP — Staff Portal</span>
            </div>
          </div>

          <div className="max-w-[420px] w-full relative z-10">

            {/* STAFF PORTAL badge */}
            <div className="flex justify-center mb-5">
              <span
                className="text-[10px] font-extrabold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full"
                style={{ background: "rgba(245,166,35,0.12)", color: "#b8791a", border: "1px solid rgba(245,166,35,0.35)" }}
              >
                ● Staff Portal
              </span>
            </div>

            {/* Card */}
            <div
              className="bg-white rounded-2xl p-8 md:p-10"
              style={{
                boxShadow: "0 8px 40px rgba(10,22,40,0.12)",
                border: "1px solid rgba(245,166,35,0.2)",
              }}
            >
              {/* Card header */}
              <div className="flex items-start gap-3.5 mb-8">
                <div className="w-1 h-10 rounded-full mt-0.5 flex-shrink-0" style={{ background: "#F5A623" }} />
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">Staff Sign In</h2>
                  <p className="text-gray-400 text-xs mt-1.5 font-medium">Access the YANTEC Engineering ERP — Staff Portal</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Staff ID */}
                <div>
                  <label htmlFor="staff_id" className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "#0A1628" }}>
                    Staff ID
                  </label>
                  <Input
                    type="text"
                    name="staff_id"
                    id="staff_id"
                    size="large"
                    value={values.staff_id}
                    onChange={handleChange}
                    placeholder="Enter your staff ID"
                    prefix={<UserOutlined style={{ color: "#F5A623" }} className="mr-1" />}
                    className={`!rounded-xl !bg-slate-50 !text-sm !font-medium !transition-all ${
                      errors.staff_id && touched.staff_id
                        ? "!border-red-400"
                        : "!border-slate-200 hover:!border-[#F5A623] focus-within:!border-[#F5A623]"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.staff_id && touched.staff_id && (
                    <span className="text-red-500 text-[10px] mt-1.5 block font-bold uppercase tracking-wider">{errors.staff_id}</span>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#0A1628" }}>
                      Password
                    </label>
                    <Link to="/employee/password-reset/request-otp" className="text-[11px] font-bold transition-colors" style={{ color: "#F5A623" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <Input.Password
                    id="password"
                    name="password"
                    size="large"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    prefix={<LockOutlined style={{ color: "#F5A623" }} className="mr-1" />}
                    className={`!rounded-xl !bg-slate-50 !text-sm !font-medium !transition-all ${
                      errors.password && touched.password ? "!border-red-400" : "!border-slate-200 focus-within:!border-[#F5A623]"
                    }`}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone twoToneColor="#F5A623" /> : <EyeInvisibleOutlined style={{ color: "#F5A623" }} />
                    }
                    disabled={isLoading}
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500 text-[10px] mt-1.5 block font-bold uppercase tracking-wider">{errors.password}</span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-[0.18em] text-[11px] mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: isLoading
                      ? "#b8791a"
                      : "linear-gradient(135deg, #0A1628 0%, #0D2244 50%, #1A3A6B 100%)",
                    boxShadow: "0 8px 24px rgba(10,22,40,0.35)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Authenticating...
                    </>
                  ) : "Access Staff Portal"}
                </button>

                {/* Links */}
                <div className="pt-5 flex items-center justify-center gap-5" style={{ borderTop: "1px solid rgba(245,166,35,0.15)" }}>
                  <Link to="/employee/activate-account" className="text-[11px] font-bold uppercase tracking-widest transition-all" style={{ color: "#0A1628" }}>
                    Activate Account
                  </Link>
                  <span className="w-1 h-1 rounded-full" style={{ background: "#F5A623" }} />
                  <Link to="/" className="text-[11px] font-bold uppercase tracking-widest transition-all" style={{ color: "#0A1628" }}>
                    Admin Portal
                  </Link>
                </div>
              </form>
            </div>

            {/* Below card */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "rgba(10,22,40,0.45)" }}>
                © {new Date().getFullYear()} YANTEC Engineering Limited · All Rights Reserved
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(10,22,40,0.3)" }}>
                Takoradi, Ghana · yantecengineering@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
