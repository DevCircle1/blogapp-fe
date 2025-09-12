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
        <Route path="/check-ip" element={<IPAddressChecker />} />
      </Routes>

      {shouldShowNavbar(location.pathname) && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
