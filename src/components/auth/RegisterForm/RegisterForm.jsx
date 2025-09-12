import React, { useState } from "react";
import { signup } from "../../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm password";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const response = await signup({
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
    });

    if (!response.success) {
      // show each backend error
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
        toast.error(response.message || "Signup failed");
      }
      setLoading(false);
      return; // ⛔ stop here — do not navigate
    }

    // ✅ success
    toast.success("Account created successfully. OTP sent to your email ✅");
    setFormData({ email: "", password: "", confirm_password: "" });
    navigate("/verify-otp", { state: { email: formData.email } });

    setLoading(false);
  };

  const getInputClassName = (field) => {
    const base =
      "bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5";
    const err = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const normal = "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    return `${base} ${errors[field] ? err : normal}`;
  };

  return (
    <section className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 sm:max-w-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Create an account
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={getInputClassName("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={getInputClassName("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={getInputClassName("confirm_password")}
                disabled={loading}
              />
              {errors.confirm_password && (
                <p className="text-sm text-red-600">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
