'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from '../../context/AuthContext.jsx';
import Navbar from '../../components/common/Navbar/Navbar.jsx';
import Footer from '../../components/common/Footer/Footer.jsx';
import ScrollToTop from '../../components/common/ScrollToTop.jsx';
import { shouldShowNavbar } from '../../utils/navbarUtils.js';

/**
 * Everything that wraps every page: auth, navbar, footer, toasts and page-view tracking.
 * `chromeLang` pins the navbar and footer language; by default it follows the URL.
 */
export default function SiteShell({ chromeLang, children }) {
  const pathname = usePathname();

  // GA4 is loaded with send_page_view:false (see RootDocument) because its own
  // auto-pageview fires once, on the initial load, and cannot see client-side
  // route changes. This sends one page_view per route, including the first.
  // gtag() is a queue stub until the deferred script loads, so calling it
  // immediately is safe either way.
  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  const chrome = shouldShowNavbar(pathname);
  return (
    <AuthProvider>
      <ScrollToTop />
      {chrome && <Navbar lang={chromeLang} />}
      {children}
      {chrome && <Footer lang={chromeLang} />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AuthProvider>
  );
}
