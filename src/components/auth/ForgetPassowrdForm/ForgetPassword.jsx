import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService } from '../../../services/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    if (!acceptedTerms) {
      toast.error('You must accept the Terms and Conditions');
      return;
    }
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
if (result.success) {
  toast.success(result.message || 'OTP sent to your email. Please check your inbox.');
  localStorage.setItem('resetEmail', email);
  navigate('/verify-otp', { state: { email } });
} else {
  toast.error(result.message.error || 'Failed to send OTP. Please try again.');
}
    } catch (error) {
      console.error('Forgot password error:', error);
      let backendError = 'An unexpected error occurred. Please try again.';
      if (error.response) {
        if (typeof error.response.data === 'string') {
          backendError = error.response.data;
        } else if (typeof error.response.data === 'object') {
          backendError =
            error.response.data.error ||
            error.response.data.message ||
            backendError;
        }
      } else if (error.message) {
        backendError = error.message;
      }
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-24 h-24"
            src="logo.png"
            alt="logo"
          />
          <span className="-ml-6">DevCircle</span>
        </Link>
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password?
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Don't fret! Just type in your email and we will send you a code to
            reset your password!
          </p>
          <form
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{' '}
                  <Link
                    to="/terms-and-conditions"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Reset password'}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}