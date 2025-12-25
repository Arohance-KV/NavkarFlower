import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import { useLoginMutation } from "../Services/authApi";
import { setAuth } from "../Redux/authSlice";

const Login = ({ switchToSignup, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================
  // RTK QUERY
  // ==========================
  const [login, { isLoading, error }] = useLoginMutation();

  // ==========================
  // LOCAL STATE (UNCHANGED)
  // ==========================
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // ==========================
  // HANDLERS
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    try {
      const data = await login({
        email: form.email.trim(),
        password: form.password,
      }).unwrap();

      // Save token
      localStorage.setItem("accessToken", data.accessToken);

      // Update auth UI state
      dispatch(setAuth(data));

      setSuccess(true);
      setForm({ email: "", password: "" });

      setTimeout(() => {
        onClose();
        navigate("/");
      }, 1500);
    } catch {
      // handled by RTK Query error
    }
  };

  const handleClose = () => {
    onClose();
  };

  // ==========================
  // RENDER (UI SAME)
  // ==========================
  return (
    <div className="border-2 border-amber-900 p-2 rounded-3xl [corner-shape:scoop]">
      <div className="relative bg-[#f6efe6] rounded-3xl [corner-shape:Scoop] shadow-2xl px-8 py-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-amber-800">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 border-2 bg-[#b8926d] rounded-full text-amber-900 cursor-pointer z-10"
        >
          <FiX size={22} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/assets/logo1.png"
            alt="Navkar Flowers"
            className="h-20 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold font-script text-[#7b4a2e] mb-6">
          Sign In
        </h1>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FiCheckCircle className="text-green-600" size={18} />
            <p className="text-green-700 font-slab text-xs">
              Login successful!
            </p>
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="text-red-600" size={18} />
            <p className="text-red-700 font-slab text-xs">
              {error?.data?.message || "Invalid credentials"}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 font-slab text-[#7b5a45]"
        >
          {/* Email */}
          <div>
            <div className="relative">
              <FiMail className="absolute left-0 top-3 text-[#b59a87]" size={16} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-6 bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                  validationErrors.email
                    ? "border-red-400"
                    : "border-[#d6c4b2] focus:border-[#b8926d]"
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <FiLock className="absolute left-0 top-3 text-[#b59a87]" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-6 pr-10 bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                  validationErrors.password
                    ? "border-red-400"
                    : "border-[#d6c4b2] focus:border-[#b8926d]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-[#b59a87]"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {validationErrors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-5 py-2.5 rounded-lg font-semibold text-sm transition ${
              isLoading
                ? "bg-[#a88a5f] opacity-70"
                : "bg-[#c9a47c] hover:bg-[#b8926d]"
            } text-white`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-5 text-center text-xs text-[#7b5a45] font-slab">
          Don't have an account?{" "}
          <button
            onClick={switchToSignup}
            className="text-[#c9a47c] hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
