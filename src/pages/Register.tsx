import { useEffect, useState } from "react";
import { PageTitle } from "../utils/PageTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { styles } from "../styles";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/features/auth/authApi";

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Register = () => {
  PageTitle("Register");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [register, { isLoading, data, error, isSuccess }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      const message = data?.message || "Registration Successful";
      toast.success(message);
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const visible = {
    display: passwordVisible ? "block" : "none",
  };
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name,
        email,
        password,
      };
      await register(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-1 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {/* Register */}
          </h2>
        </div>

        <div className="mx-auto sm:mx-auto sm:w-full sm:max-w-sm max-sm:w-[80%]">
          <div className="bg-white py-5 px-3 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div className="w-full mb-3">
                <label htmlFor="email" className={`${styles.label}`}>
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter your full name"
                  className={`${
                    errors.name && touched.name && "border-red-500"
                  } ${styles.input}`}
                />
                {errors.name && touched.name && (
                  <span className="text-red-500 pt-2 block">{errors.name}</span>
                )}
              </div>
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
                    errors.email && touched.email && "border-red-500"
                  } ${styles.input}`}
                />
                {errors.email && touched.email && (
                  <span className="text-red-500 pt-2 block">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="w-full mb-3 relative">
                <label htmlFor="password" className={`${styles.label}`}>
                  Password
                </label>
                <input
                  type={!passwordVisible ? "password" : "text"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  id="password"
                  placeholder="Enter your password"
                  className={`${
                    errors.password && touched.password && "border-red-500"
                  }  ${styles.input}`}
                />
                {!passwordVisible ? (
                  <AiOutlineEyeInvisible
                    style={visible}
                    className="absolute bottom-[10px] right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setPasswordVisible(true)}
                  />
                ) : (
                  <AiOutlineEye
                    style={visible}
                    className="absolute bottom-[10px] right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setPasswordVisible(false)}
                  />
                )}
                {errors.password && touched.password && (
                  <span className="text-red-500 pt-2 block">
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="w-full mb-3 relative">
                <label htmlFor="confirm-password" className={`${styles.label}`}>
                  Confirm Password
                </label>
                <input
                  type={!passwordVisible ? "password" : "text"}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  id="confirm-password"
                  placeholder="Confirm your password"
                  className={`${
                    errors.password && touched.password && "border-red-500"
                  }  ${styles.input}`}
                />
                {!passwordVisible ? (
                  <AiOutlineEyeInvisible
                    style={visible}
                    className="absolute bottom-[10px] right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setPasswordVisible(true)}
                  />
                ) : (
                  <AiOutlineEye
                    style={visible}
                    className="absolute bottom-[10px] right-2 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setPasswordVisible(false)}
                  />
                )}
                {errors.password && touched.password && (
                  <span className="text-red-500 pt-2 block">
                    {errors.password}
                  </span>
                )}
              </div>
              <div className="w-full mt-5">
                <input
                  type="submit"
                  value={`${isLoading ? "Please wait..." : "Sign up"}`}
                  className={`${styles.button}`}
                />
              </div>
              <br />
              <h5 className="text-center text-[13px] text-black">
                Or join with
              </h5>
              <h5 className="text-center pt-4 text-[13px] text-black">
                Already have an account?
                <span
                  className="text-[#2190ff] pl-1 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </h5>
              <br />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
