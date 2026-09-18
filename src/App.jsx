import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/common/Navbar/Navbar.jsx';
import { LOCALES, LOCALIZED_LANGS, langFromPath } from './i18n/locales.js';
import { shouldShowNavbar } from './utils/navbarUtils.js';
import Footer from './components/common/Footer/Footer.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = lazy(() => import('./components/auth/RegisterForm/RegisterForm.jsx'));
const LoginForm = lazy(() => import('./components/auth/LoginForm/LoginForm.jsx'));
const ForgetPassword = lazy(() => import('./components/auth/ForgetPassowrdForm/ForgetPassword.jsx'));
const UpdatePassword = lazy(() => import('./components/auth/UpdatePasswordForm/UpdatePassword.jsx'));
const ToolsPage = lazy(() => import('./components/tools/ToolsPage.jsx'));
const IPAddressChecker = lazy(() => import('./components/tools/ip.jsx'));
const ScreenResolutionTool = lazy(() => import('./components/tools/ScreenResolutionTool.jsx'));
const TextToHtmlTool = lazy(() => import('./components/tools/TextToHtmlTool.jsx'));
const WriteBlog = lazy(() => import('./components/blogs/WriteBlogs.jsx'));
const BlogPostDetail = lazy(() => import('./components/blogs/BlogPostDetail.jsx'));
const BlogCategories = lazy(() => import('./components/blogs/BlogCategories.jsx'));
const CategoryBlogPosts = lazy(() => import('./components/blogs/CategoryBlogPosts.jsx'));
const TermsAndConditions = lazy(() => import('./components/common/Terms/Terms.jsx'));
const AboutUs = lazy(() => import('./components/common/Terms/AboutUs.jsx'));
const ContactUs = lazy(() => import('./components/common/Terms/ContactUs.jsx'));
const HelpCenter = lazy(() => import('./components/common/Terms/HelpCenter.jsx'));
const PrivacyPolicy = lazy(() => import('./components/common/Terms/PrivacyPolicy.jsx'));
const JobAlert = lazy(() => import('./components/common/Terms/JobAlerts.jsx'));
const HomePage = lazy(() => import('./components/common/Home/HomePage.jsx'));
const CodeShare = lazy(() => import('./components/tools/CodeShare.jsx'));
const Q = lazy(() => import('./components/tools/Q.jsx'));
const CreateQuestion = lazy(() => import('./components/tools/CreateQuestion.jsx'));
const QuestionDetail = lazy(() => import('./components/tools/QuestionDetail.jsx'));
const MyAnswers = lazy(() => import('./components/tools/MyAnswers.jsx'));
const WordleGame = lazy(() => import('./components/tools/WordleGame.jsx'));
const PremiumToolSuite = lazy(() => import('./components/tools/PremiumToolSuite.jsx'));
const LocalizedToolPage = lazy(() => import('./components/tools/localized/LocalizedToolPage.jsx'));
const LocalizedToolsHub = lazy(() => import('./components/tools/localized/LocalizedToolsHub.jsx'));
const NotFound = lazy(() => import('./components/common/NotFound.jsx'));
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/blogs" element={<BlogCategories />} />
        <Route path="/blogs/category/:categorySlug" element={<CategoryBlogPosts />} />
        <Route path="/blogs/article/:slug" element={<BlogPostDetail />} />
        <Route path="/write-blogs" element={<WriteBlog />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:toolSlug" element={<PremiumToolSuite />} />
        <Route path="/check-ip" element={<IPAddressChecker />} />
        <Route path="/screen-resolution" element={<ScreenResolutionTool />} />
        <Route path="/text-to-html" element={<TextToHtmlTool />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/job-alert" element={<JobAlert />} />
        <Route path="/codes" element={<CodeShare />} />
        <Route path="/codes/:id" element={<CodeShare />} />
        <Route path="/ask-anything" element={<Q />} />
        <Route path="/create" element={<CreateQuestion />} />
        <Route path="/q/:id" element={<QuestionDetail />} />
        <Route path="/my-answers" element={<MyAnswers />} />
        <Route path="/word-game" element={<WordleGame />} />
        {/* Language versions of the tool catalogue: /es, /es/<localized-slug>, … */}
        {LOCALIZED_LANGS.map((lang) => (
          <Route key={`${lang}-hub`} path={`/${lang}`} element={<LocalizedToolsHub lang={lang} />} />
        ))}
        {LOCALIZED_LANGS.map((lang) => (
          <Route key={`${lang}-tool`} path={`/${lang}/:toolSlug`} element={<LocalizedToolPage lang={lang} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense>

      {shouldShowNavbar(location.pathname) && <Footer />}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </HelmetProvider>
  );
}
export default App;
