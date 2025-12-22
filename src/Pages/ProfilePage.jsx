import React from "react";
import { FiUser, FiMail, FiPhone, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // 🔹 Example: fetch user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest User",
    email: "guest@example.com",
    phone: "Not available",
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/assets/ProdBgImg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#f6efe6]/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#fbf7f3]
                      rounded-2xl shadow-2xl px-10 py-12
                      border border-[#eadfda]">

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#c7a17a]/20
                          flex items-center justify-center">
            <FiUser size={36} className="text-[#7b4a2e]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl font-script text-[#7b4a2e] mb-8">
          My Profile
        </h1>

        {/* Info */}
        <div className="space-y-5 font-slab text-[#7b5a45]">
          <div className="flex items-center gap-4">
            <FiUser className="text-[#b8926d]" />
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <FiMail className="text-[#b8926d]" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-4">
            <FiPhone className="text-[#b8926d]" />
            <span>{user.phone}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#eadfda]" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2
                     bg-[#c7a17a] text-white py-3 rounded-lg
                     font-slab font-medium tracking-wide
                     hover:bg-[#b8926d] transition shadow-md"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
