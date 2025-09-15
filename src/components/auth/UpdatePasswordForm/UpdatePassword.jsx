import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../../../services/auth';

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      toast.error('Reset email not found. Please restart reset process.');
      return;
    }

    const result = await authService.resetPassword({
      email,
      password: formData.password,
      confirm_password: formData.confirm_password
    });

    if (result.success) {
      toast.success(result.message || 'Password reset successful');
      localStorage.removeItem('resetEmail');
      navigate('/');
    } else {
      toast.error(result.message || 'Failed to reset password');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-24 h-24" src="1-removebg-preview.png" alt="logo" />
          <span className="-ml-6">DevCircle</span>
        </a>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Password
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                           focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                           focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                           dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 
                         focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm 
                         px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 
                         dark:focus:ring-primary-800"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
