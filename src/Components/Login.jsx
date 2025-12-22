import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Login = ({ switchToSignup, onClose }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative bg-[#fbf7f3]/95 backdrop-blur-xl rounded-2xl shadow-2xl px-8 py-10 border border-[#eadfda]">
      
      {/* ❌ Close Button (INSIDE CARD) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer text-[#7b5a45] hover:text-[#b8926d] transition"
      >
        <FiX size={22} />
      </button>

      {/* Logo */}
      <img
        src="/assets/logo1.png"
        alt="Navkar Flowers"
        className="h-25 mx-auto mb-4"
      />

      {/* Heading */}
      <h1 className="text-center text-4xl font-bold font-script text-[#7b4a2e] mb-8">
        Sign In
      </h1>

      {/* Form */}
      <form className="space-y-5">
        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-3 top-4 text-[#b59a87]" />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full pl-10 py-3 font-slab rounded-lg border border-[#dccbc0]
            bg-transparent focus:outline-none focus:ring-1 focus:ring-[#c7a17a]"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-4 text-[#b59a87]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full pl-10 pr-10 py-3 font-slab rounded-lg border border-[#dccbc0]
            bg-transparent focus:outline-none focus:ring-1 focus:ring-[#c7a17a]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-[#b59a87]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <button className="text-sm font-slab text-[#a67855] hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#c7a17a] text-white py-3 rounded-lg
          font-slab tracking-wide hover:bg-[#b8926d]
          transition shadow-md"
        >
          Sign In
        </button>
      </form>

      {/* Switch */}
      <p className="mt-8 text-center text-sm font-slab text-[#7b5a45]">
        Don’t have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-[#c7a17a] underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
