import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/common/Navbar/Navbar.jsx'
import RegisterForm from './components/auth/RegisterForm/RegisterForm.jsx'
import LoginForm from './components/auth/LoginForm/LoginForm.jsx'
import ForgetPassword from './components/auth/ForgetPassowrdForm/ForgetPassword.jsx'
import UpdatePassword from './components/auth/UpdatePasswordForm/UpdatePassword.jsx'
import VerifyOtp from './components/auth/VerifyOtp/VerifyOtp.jsx'
import { shouldShowNavbar } from './utils/navbarUtils.js'  
import Footer from './components/common/Footer/Footer.jsx'
import IPAddressChecker from './components/tools/ip.jsx'
import { ToastContainer } from 'react-toastify'
import WriteBlog from './components/blogs/WriteBlogs.jsx'
import Blogs from './components/blogs/blogs.jsx'
import BlogPostDetail from './components/blogs/BlogPostDetail.jsx'
import TermsAndConditions from './components/common/Terms/Terms.jsx'
import AboutUs from './components/common/Terms/AboutUs.jsx'
import ContactUs from './components/common/Terms/ContactUs.jsx'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const location = useLocation()

  return (
    <>
      {shouldShowNavbar(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<h1 className="p-6 text-2xl">Welcome to Blog App 📝</h1>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/write-blogs" element={<WriteBlog />} />
        <Route path="/check-ip" element={<IPAddressChecker />} />
        <Route path="/posts/:id" element={<BlogPostDetail />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />

      </Routes>

      {shouldShowNavbar(location.pathname) && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
