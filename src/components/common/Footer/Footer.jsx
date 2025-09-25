import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { publicRequest } from '../../../services/api'; 

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
      const res = await publicRequest.post('/subscribe/', {
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
          <h2 className="text-2xl font-bold text-gray-900">TalkandTool</h2>
          <p className="mt-4 text-sm text-gray-600">
            Building modern solutions for the future of web and mobile.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/about-us" className="hover:text-gray-900 transition">About Us</a></li>
            <li><a href="/blogs" className="hover:text-gray-900 transition">Blogs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/help-center" className="hover:text-gray-900 transition">Help Center</a></li>
            <li><a href="/terms-and-conditions" className="hover:text-gray-900 transition">Terms of Service</a></li>
            <li><a href="/privacy-policy" className="hover:text-gray-900 transition">Privacy Policy</a></li>
            <li><a href="/contact-us" className="hover:text-gray-900 transition">Contact Us</a></li>
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
        © {new Date().getFullYear()} TalkandTool. All rights reserved.
      </div>
    </footer>
  );
}