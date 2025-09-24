import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/common/Navbar/Navbar.jsx'
import RegisterForm from './components/auth/RegisterForm/RegisterForm.jsx'
import LoginForm from './components/auth/LoginForm/LoginForm.jsx'
import ForgetPassword from './components/auth/ForgetPassowrdForm/ForgetPassword.jsx'
import UpdatePassword from './components/auth/UpdatePasswordForm/UpdatePassword.jsx'
import VerifyOtp from './components/auth/VerifyOtp/VerifyOtp.jsx'
import { shouldShowNavbar } from './utils/navbarUtils.js'  
import Footer from './components/common/Footer/Footer.jsx'
import ToolsPage from './components/tools/ToolsPage.jsx'
import IPAddressChecker from './components/tools/ip.jsx'
import ScreenResolutionTool from './components/tools/ScreenResolutionTool.jsx'
import ProfitMarginCalculator from './components/tools/ProfitMarginCalculator.jsx'
import { ToastContainer } from 'react-toastify'
import WriteBlog from './components/blogs/WriteBlogs.jsx'
import Blogs from './components/blogs/blogs.jsx'
import BlogPostDetail from './components/blogs/BlogPostDetail.jsx'
import TermsAndConditions from './components/common/Terms/Terms.jsx'
import AboutUs from './components/common/Terms/AboutUs.jsx'
import ContactUs from './components/common/Terms/ContactUs.jsx'
import HelpCenter from './components/common/Terms/HelpCenter.jsx'
import PrivacyPolicy from './components/common/Terms/PrivacyPolicy.jsx'
import JobAlert from './components/common/Terms/JobAlerts.jsx'
import HomePage from './components/common/Home/HomePage.jsx'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const location = useLocation()

  return (
    <>
      {shouldShowNavbar(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/write-blogs" element={<WriteBlog />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/check-ip" element={<IPAddressChecker />} />
        <Route path="/screen-resolution" element={<ScreenResolutionTool />} />
        <Route path="/profit-margin-calculator" element={<ProfitMarginCalculator />} />
        <Route path="/posts/:id" element={<BlogPostDetail />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/help-center" element={<HelpCenter />}></Route>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/job-alert" element={<JobAlert />} />
      </Routes>

      {shouldShowNavbar(location.pathname) && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
