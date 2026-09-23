import { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/common/Navbar/Navbar.jsx';
import { LOCALES, langFromPath } from './i18n/locales.js';
import { APP_ROUTES } from './appRoutes.jsx';
import { shouldShowNavbar } from './utils/navbarUtils.js';
import Footer from './components/common/Footer/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();

  // The prerendered HTML ships this route's structured data so crawlers get it
  // without running JavaScript. Once React mounts, the page's own <Seo> supplies
  // the live equivalent — leaving both in place would duplicate every schema.
  useEffect(() => {
    document
      .querySelectorAll('script[type="application/ld+json"][data-prerendered="true"]')
      .forEach((node) => node.remove());
  }, []);

  // GA4 is loaded with send_page_view:false (see index.html) because its own
  // auto-pageview only fires once, on the initial load — it has no way to see
  // client-side route changes in an SPA. This is the replacement: one
  // page_view per route, including the first. gtag() is a queue stub until
  // the deferred script loads, so calling it immediately is safe either way.
  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return (
    <HelmetProvider>
      {/* Derived from the URL rather than set by each page's <Seo>, so pages
          without one still report a language and nothing is left stale when
          navigating out of a language section. */}
      <Helmet htmlAttributes={{ lang: LOCALES[langFromPath(location.pathname)].htmlLang }} />
      <ScrollToTop />
      {shouldShowNavbar(location.pathname) && <Navbar />}

      {/* min-h-screen rather than the previous 60vh: a raw CDP layout-shift
          trace pinned the site's residual mobile CLS to this exact fallback —
          once the lazy route chunk resolves and replaces this placeholder
          with the real (taller) page, the footer sitting right below a short
          60vh box was still inside the viewport and visibly jumped down.
          Keeping the fallback at least one viewport tall keeps the footer
          below the fold during that swap on every route, since every route
          shares this one fallback and its real height varies page to page. */}
      <Suspense fallback={<div className="min-h-screen bg-slate-950" aria-label="Loading page" />}><Routes>
        {APP_ROUTES.map(({ path, Component, props }) => (
          <Route key={path} path={path} element={<Component {...props} />} />
        ))}
      </Routes></Suspense>

      {shouldShowNavbar(location.pathname) && <Footer />}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </HelmetProvider>
  );
}
export default App;
