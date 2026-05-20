/* eslint-disable no-unused-vars */
import react, { useState } from "react";
import { Mail, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, baseApi } = useAuth();
  const [message, SetMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Password Validation Logic
  const validations = {
    length: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseApi}/api/users/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      login(response.data.user, response.data.accessToken, response.data.refreshToken);
      if (response.data.success) {
        toast.success("Login successful");
        setIsSuccess(true);
      } else {
        toast.error(response.data.message);
        setIsSuccess(false);
      }
      SetMessage(response.data.message);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error("Login Error Details:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      SetMessage(errorMessage);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Form Card */}
      <div className="bg-slate-900/85 p-8 rounded-lg shadow-lg w-96 text-sm border border-white/20">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Login
        </h1>
        <p className="text-center text-indigo-300 mb-6">
          Login to admin's account
        </p>
        {/* Success Message Area */}
        {isSubmitted && (
          <div
            className={`transition-all duration-500 ease-in-out transform ${isSubmitted
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
              }`}
          >
            <div
              className={`border-l-4 p-4 mb-6 rounded-lg shadow-md ${isSuccess
                  ? "bg-green-900 border-green-500"
                  : "bg-red-900 border-red-500"
                }`}
            >
              <div className="flex items-center">
                <CheckCircle
                  className={`h-5 w-5 mr-3 ${isSuccess ? "text-green-400" : "text-red-400 "
                    }`}
                />
                <p
                  className={`font-semibold ${isSuccess ? "text-green-300" : "text-red-300"
                    }`}
                >
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Form Structure */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field  */}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-700 ">
            {/* Left Icon */}
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-transparent outline-none text-white w-full "
              placeholder="email id"
              required
            />
          </div>
          {/* Password Field  */}
          <div className="relative mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-700">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
              className="bg-transparent outline-none text-white w-full"
              required
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 transition duration-150 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
          </div>
          {/* <div className="mb-4"> 
            UI for showing password validation
            {validations.length > 0 && (
              <ul
                className="mt-2 text-sm text-gray-400"
                style={{ listStyle: "none", padding: 0 }}
              >
                <ValidationItem
                  label="At least 8 characters"
                  isValid={validations.length}
                />
                <ValidationItem
                  label="One uppercase letter"
                  isValid={validations.hasUpper}
                />
                <ValidationItem
                  label="One number"
                  isValid={validations.hasNumber}
                />
                <ValidationItem
                  label="One special character (@#$!)"
                  isValid={validations.hasSpecial}
                />
              </ul>
            )}
          </div>  */}
          <button
            type="submit"
            className="flex justify-center items-center w-full py-3 rounded-full bg-indigo-900 text-white cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-px loader mr-2"></div>
                Loging...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const ValidationItem = ({ label, isValid }) => (
  <li
    className="mb-1"
    style={{ color: isValid ? "#10b981" : "#ef4444", fontSize: "14px" }}
  >
    {isValid ? "✅" : "❌"} {label}
  </li>
);

export default Login;
