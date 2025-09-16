import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext"; 

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { loginUser } = useAuth(); 
  const [otp, setOtp] = useState(Array(6).fill(""));

  const signupEmail = localStorage.getItem("signupEmail");
  const resetEmail = localStorage.getItem("resetEmail");
  const email = signupEmail || resetEmail;

  const handleChange = (value, index) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!email || otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      const res = await publicRequest.post("/verify-otp/", {
        email,
        otp: otpCode,
      });

      toast.success(res?.data?.message || "Email verified successfully ✅");

      // ✅ If backend sends token + user
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        loginUser(res.data.user); // update AuthContext
      }

      // ✅ cleanup email flags
      localStorage.removeItem("signupEmail");
      localStorage.removeItem("resetEmail");

      // ✅ redirect
      if (signupEmail) {
        navigate("/"); // go home
      } else if (resetEmail) {
        navigate("/update-password");
      } else {
        navigate("/"); // fallback
      }
    } catch (error) {
      console.error("Email verification error:", error);
      const msg =
        error.response?.data?.error ||
        "Verification failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We sent a code to your email {email || "(unknown)"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {otp.map((digit, index) => (
                  <div className="w-12 h-12" key={index}>
                    <input
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="w-full h-full flex items-center justify-center text-center text-lg px-2 rounded-xl border border-gray-300 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-5">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full py-4 bg-blue-700 text-white rounded-xl text-sm shadow-sm hover:bg-blue-800"
                >
                  Verify Account
                </button>

                <div className="flex items-center justify-center text-sm space-x-1 text-gray-500">
                  <p>Didn't receive code?</p>
                  <button
                    type="button"
                    onClick={() => toast.info("Resend logic not implemented")}
                    className="text-blue-600"
                  >
                    Resend
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
