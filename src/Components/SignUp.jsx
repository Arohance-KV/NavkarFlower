import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import { useSignupMutation } from "../Services/authApi";

const SignUp = ({ switchToLogin, onClose }) => {
  // ==========================
  // RTK QUERY
  // ==========================
  const [signup, { isLoading, error }] = useSignupMutation();

  // ==========================
  // LOCAL STATE (UNCHANGED)
  // ==========================
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================
  // HANDLERS
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim())
      errors.firstName = "First name is required";

    if (!formData.lastName.trim())
      errors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      }).unwrap();

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        switchToLogin();
      }, 2000);
    } catch {
      // error handled by RTK Query
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
      <div className="relative bg-[#f6efe6] rounded-3xl [corner-shape:scoop] shadow-2xl px-8 py-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-amber-800">
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
        <h2 className="text-center text-3xl font-bold font-script text-[#7b4a2e] mb-6">
          Sign Up
        </h2>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FiCheckCircle className="text-green-600 flex shrink-0" size={18} />
            <p className="text-green-700 font-slab text-xs">
              Account created successfully!
            </p>
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FiAlertCircle className="text-red-600 flex shrink-0" size={18} />
            <p className="text-red-700 font-slab text-xs">
              {error?.data?.message || "Signup failed"}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 font-slab text-[#7b5a45]"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                  validationErrors.firstName
                    ? "border-red-400"
                    : "border-[#d6c4b2] focus:border-[#b8926d]"
                }`}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {validationErrors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                  validationErrors.lastName
                    ? "border-red-400"
                    : "border-[#d6c4b2] focus:border-[#b8926d]"
                }`}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                validationErrors.email
                  ? "border-red-400"
                  : "border-[#d6c4b2] focus:border-[#b8926d]"
              }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (10 digits)"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                validationErrors.phoneNumber
                  ? "border-red-400"
                  : "border-[#d6c4b2] focus:border-[#b8926d]"
              }`}
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {validationErrors.phoneNumber}
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
                placeholder="Password (min 8 characters)"
                value={formData.password}
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
                {showPassword ? (
                  <FiEyeOff size={16} />
                ) : (
                  <FiEye size={16} />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <FiLock className="absolute left-0 top-3 text-[#b59a87]" size={16} />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-6 pr-10 bg-transparent border-b py-2 text-sm focus:outline-none transition ${
                  validationErrors.confirmPassword
                    ? "border-red-400"
                    : "border-[#d6c4b2] focus:border-[#b8926d]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 top-3 text-[#b59a87]"
              >
                {showConfirm ? (
                  <FiEyeOff size={16} />
                ) : (
                  <FiEye size={16} />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} />{" "}
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-5 py-2.5 rounded-lg font-semibold tracking-wide text-sm transition shadow-md ${
              isLoading
                ? "bg-[#a88a5f] text-white opacity-70"
                : "bg-[#c9a47c] text-white hover:bg-[#b8926d]"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-[#7b5a45] font-slab">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-[#c9a47c] hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
