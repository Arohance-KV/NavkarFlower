import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiX,
} from "react-icons/fi";

const SignUp = ({ switchToLogin, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative bg-[#f6efe6] rounded-2xl shadow-2xl px-10 py-12 w-full max-w-lg border border-[#e6d7c6]">
      
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-[#7b5a45] hover:text-[#b8926d] transition cursor-pointer"
      >
        <FiX size={22} />
      </button>

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/assets/logo1.png"
          alt="Navkar Flowers"
          className="h-25 object-contain"
        />
      </div>

      {/* Heading */}
      <h2 className="text-center text-4xl font-bold font-script text-[#7b4a2e] mb-10">
        Sign Up
      </h2>

      {/* Form */}
      <form className="space-y-6 font-slab text-[#7b5a45]">
        {/* Name */}
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="First Name"
            className="w-full bg-transparent border-b border-[#d6c4b2]
            focus:outline-none focus:border-[#b8926d] py-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full bg-transparent border-b border-[#d6c4b2]
            focus:outline-none focus:border-[#b8926d] py-2"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-transparent border-b border-[#d6c4b2]
          focus:outline-none focus:border-[#b8926d] py-2"
        />

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-0 top-3 text-[#b59a87]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-7 pr-10 bg-transparent border-b border-[#d6c4b2]
            focus:outline-none focus:border-[#b8926d] py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-3 text-[#b59a87]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FiLock className="absolute left-0 top-3 text-[#b59a87]" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full pl-7 pr-10 bg-transparent border-b border-[#d6c4b2]
            focus:outline-none focus:border-[#b8926d] py-2"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-0 top-3 text-[#b59a87]"
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-[#c9a47c] text-white py-3 rounded-lg
          font-semibold tracking-wide hover:bg-[#b8926d]
          transition shadow-md"
        >
          Create Account
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-[#7b5a45] font-slab">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-[#c9a47c] font-slab cursor-pointer hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUp;
