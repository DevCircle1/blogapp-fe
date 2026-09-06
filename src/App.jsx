import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
import Navbar from './components/common/Navbar/Navbar.jsx';
import { shouldShowNavbar } from './utils/navbarUtils.js';
import Footer from './components/common/Footer/Footer.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = lazy(() => import('./components/auth/RegisterForm/RegisterForm.jsx'));
const LoginForm = lazy(() => import('./components/auth/LoginForm/LoginForm.jsx'));
const ForgetPassword = lazy(() => import('./components/auth/ForgetPassowrdForm/ForgetPassword.jsx'));
const UpdatePassword = lazy(() => import('./components/auth/UpdatePasswordForm/UpdatePassword.jsx'));
const ToolsPage = lazy(() => import('./components/tools/ToolsPage.jsx'));
const IPAddressChecker = lazy(() => import('./components/tools/ip.jsx'));
const ScreenResolutionTool = lazy(() => import('./components/tools/ScreenResolutionTool.jsx'));
const ProfitMarginCalculator = lazy(() => import('./components/tools/ProfitMarginCalculator.jsx'));
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
const NotFound = lazy(() => import('./components/common/NotFound.jsx'));
function App() {
  const location = useLocation();
  return (
    <HelmetProvider>
      {shouldShowNavbar(location.pathname) && <Navbar />}

      <Suspense fallback={<div className="min-h-[60vh] bg-slate-950" aria-label="Loading page" />}><Routes>
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
        <Route path="/profit-margin-calculator" element={<ProfitMarginCalculator />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense>

      {shouldShowNavbar(location.pathname) && <Footer />}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </HelmetProvider>
  );
}
export default App;
