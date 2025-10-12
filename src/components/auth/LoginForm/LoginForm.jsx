import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../../assets/logo.png";
export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    const response = await login(formData);
    if (response.success) {
      toast.success("Login successful");
      const tokens = response.data.tokens;
      const userData = response.data.user || null;
      loginUser(tokens, userData);
      navigate("/");
    } else {
      if (response.details) {
        const newErrors = {};
        Object.keys(response.details).forEach((field) => {
          const message = Array.isArray(response.details[field])
            ? response.details[field][0]
            : response.details[field];
          newErrors[field] = message;
          toast.error(message);
        });
        setErrors(newErrors);
      } else {
        const errorMsg = response.message || "Login failed";
        toast.error(errorMsg);
      }
    }
    setLoading(false);
  };
  const getInputClassName = (field) => {
    const base =
      "bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
    const err = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const normal =
      "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500";
    return `${base} ${errors[field] ? err : normal}`;
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-24 h-24" src={logo} alt="logo" />
          <span className="-ml-6">Talk and Tool</span>
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClassName("email")}
                  placeholder="name@company.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={getInputClassName("password")}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 top-7 flex items-center text-gray-500 dark:text-gray-300"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="text-right text-sm font-light text-gray-500 dark:text-gray-400">
                <Link
                  to="/forget-password"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-right">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up here
                </Link>
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center mt-4">
                <Link
                  to="/"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  ← Back to Home Page
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
