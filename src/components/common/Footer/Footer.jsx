import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../../services/api'; 

const POPULAR_TOOLS = [
  ['/tools/word-counter', 'Word Counter'],
  ['/tools/percentage-calculator', 'Percentage Calculator'],
  ['/tools/loan-calculator', 'Loan Calculator'],
  ['/tools/bmi-calculator', 'BMI Calculator'],
  ['/tools/json-studio', 'JSON Formatter'],
  ['/tools/password-generator', 'Password Generator'],
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await publicRequest.post('/subscribe/', {
        email: email.trim()
      });

      toast.success("You have subscribed successfully! 🎉");
      setEmail(''); // Clear input after success
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      "Failed to subscribe. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailEmpty = !email.trim();

  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo / Brand */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Talk &amp; Tool</h2>
          <p className="mt-4 text-sm text-gray-600">
            Free online calculators, converters, and developer tools that run entirely in your browser, plus practical guides.
          </p>
        </div>

        {/* Popular tools — internal links from every page keep the deeper
            tool pages discoverable and spread link equity across the site. */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Popular tools</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {POPULAR_TOOLS.map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-gray-900 transition">{label}</Link></li>
            ))}
            <li><Link to="/tools" className="font-semibold text-blue-600 hover:underline">All tools →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about-us" className="hover:text-gray-900 transition">About Us</Link></li>
            <li><Link to="/blogs" className="hover:text-gray-900 transition">Blog</Link></li>
            <li><Link to="/help-center" className="hover:text-gray-900 transition">Help Center</Link></li>
            <li><Link to="/contact-us" className="hover:text-gray-900 transition">Contact Us</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-gray-900 transition">Terms of Service</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gray-900 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="mt-4 flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg bg-white text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || isEmailEmpty}
              className={`px-4 py-2 rounded-r-lg text-sm font-medium text-white transition duration-200 ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : isEmailEmpty 
                    ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-600">
            Get the latest updates and news delivered to your inbox.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Talk &amp; Tool. All rights reserved.</p>
        <p className="mt-2 text-xs text-gray-500">
          The calculators on this site are provided for general information only and are not financial, medical, or legal advice.
        </p>
      </div>
    </footer>
  );
}