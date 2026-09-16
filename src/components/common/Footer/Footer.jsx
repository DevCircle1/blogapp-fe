import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { publicRequest } from '../../../services/api';
import {
  ALL_LANGS, CHROME, LOCALES, hubPath, langFromPath, toolPath,
} from '../../../i18n/locales.js';

const POPULAR_TOOLS = [
  ['/tools/word-counter', 'Word Counter'],
  ['/tools/percentage-calculator', 'Percentage Calculator'],
  ['/tools/loan-calculator', 'Loan Calculator'],
  ['/tools/bmi-calculator', 'BMI Calculator'],
  ['/tools/json-studio', 'JSON Formatter'],
  ['/tools/password-generator', 'Password Generator'],
];

const ENGLISH = {
  tagline: 'Free online calculators, converters, and developer tools that run entirely in your browser, plus practical guides.',
  popularTools: 'Popular tools',
  allTools: 'All tools →',
  footer: {
    company: 'Company', about: 'About Us', blog: 'Blog', help: 'Help Center', contact: 'Contact Us',
    terms: 'Terms of Service', privacy: 'Privacy Policy', stayUpdated: 'Stay Updated',
    emailPlaceholder: 'Enter your email', subscribe: 'Subscribe', subscribing: 'Subscribing...',
    newsletterNote: 'Get the latest updates and news delivered to your inbox.',
    rights: 'All rights reserved.',
    disclaimer: 'The calculators on this site are provided for general information only and are not financial, medical, or legal advice.',
  },
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // Inside a language section the footer follows that language, and its
  // popular-tool links point at that language's versions of the tools.
  const lang = langFromPath(location.pathname);
  const copy = CHROME[lang] || ENGLISH;
  const popular = lang === 'en'
    ? POPULAR_TOOLS
    : copy.popular.map(([slug, label]) => [toolPath(lang, slug), label]);

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
            {copy.tagline}
          </p>
        </div>

        {/* Popular tools — internal links from every page keep the deeper
            tool pages discoverable and spread link equity across the site. */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{copy.popularTools}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {popular.map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-gray-900 transition">{label}</Link></li>
            ))}
            <li><Link to={hubPath(lang)} className="font-semibold text-blue-600 hover:underline">{copy.allTools}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">{copy.footer.company}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about-us" className="hover:text-gray-900 transition">{copy.footer.about}</Link></li>
            <li><Link to="/blogs" className="hover:text-gray-900 transition">{copy.footer.blog}</Link></li>
            <li><Link to="/help-center" className="hover:text-gray-900 transition">{copy.footer.help}</Link></li>
            <li><Link to="/contact-us" className="hover:text-gray-900 transition">{copy.footer.contact}</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-gray-900 transition">{copy.footer.terms}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gray-900 transition">{copy.footer.privacy}</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{copy.footer.stayUpdated}</h3>
          <form onSubmit={handleSubscribe} className="mt-4 flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.footer.emailPlaceholder}
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
              {isSubmitting ? copy.footer.subscribing : copy.footer.subscribe}
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-600">
            {copy.footer.newsletterNote}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
        {/* Sitewide links to every language's tool directory, so crawlers
            reach each language section from any page on the site. */}
        <nav aria-label="Languages" className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Globe size={14} aria-hidden="true" />
          {ALL_LANGS.map((code) => (
            <Link
              key={code}
              to={hubPath(code)}
              hrefLang={LOCALES[code].hreflang}
              lang={LOCALES[code].htmlLang}
              className={code === lang ? 'font-semibold text-gray-900' : 'hover:text-gray-900 transition'}
            >
              {LOCALES[code].name}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} Talk &amp; Tool. {copy.footer.rights}</p>
        <p className="mt-2 text-xs text-gray-500">
          {copy.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
