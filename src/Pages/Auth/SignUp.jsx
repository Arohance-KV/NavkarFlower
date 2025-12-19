import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiUser,
  FiLock,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const err = {};

    if (!form.firstName) err.firstName = "First name is required";
    if (!form.lastName) err.lastName = "Last name is required";

    if (!form.email) {
      err.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      err.email = "Enter a valid email address";
    }

    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      err.confirmPassword = "Confirm your password";
    } else if (form.confirmPassword !== form.password) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 🔗 Replace with real API
      await new Promise((res) => setTimeout(res, 1500));
      console.log("Signup Data:", form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Join us by filling in the details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                disabled={loading}
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border
                focus:ring-2 focus:ring-amber-500 focus:outline-none
                disabled:bg-gray-100
                ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                disabled={loading}
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border
                focus:ring-2 focus:ring-amber-500 focus:outline-none
                disabled:bg-gray-100
                ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              disabled={loading}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border
              focus:ring-2 focus:ring-amber-500 focus:outline-none
              disabled:bg-gray-100
              ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Create Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              disabled={loading}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg border
              focus:ring-2 focus:ring-amber-500 focus:outline-none
              disabled:bg-gray-100
              ${errors.password ? "border-red-500" : "border-gray-300"}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              disabled={loading}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              className={`w-full pl-10 pr-10 py-2.5 rounded-lg border
              focus:ring-2 focus:ring-amber-500 focus:outline-none
              disabled:bg-gray-100
              ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium
          hover:bg-amber-700 transition-all flex items-center justify-center
          disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-amber-600 font-medium hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
