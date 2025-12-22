import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ShoppingCart, Menu, X, LogOut, ShoppingBag } from "lucide-react";
import { FiUser } from "react-icons/fi";
import AuthModal from "./AuthModal";
import { logout } from "../Redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: "About us", href: "/about" },
    { label: "Contact US", href: "/contact" },
  ];

  const handleProfileClick = () => {
    navigate("/profile");
    setProfileDropdown(false);
  };

  const handleOrdersClick = () => {
    navigate("/orders");
    setProfileDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setProfileDropdown(false);
    window.location.reload();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-[#eae5d7] shadow-md">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center">
              <img
                src="./assets/logo.png"
                alt="NAKAR Logo"
                className="h-16 w-auto cursor-pointer"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="border border-amber-900 rounded-xl [corner-shape:scoop] px-8 py-2 flex gap-12 font-slab">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `transition-colors whitespace-nowrap ${
                        isActive
                          ? "text-amber-900 font-semibold"
                          : "text-gray-500 hover:text-amber-700"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <button className="text-amber-900 hover:text-amber-700 transition">
                <Search size={24} />
              </button>

              <button className="text-amber-900 hover:text-amber-700 transition">
                <ShoppingCart size={24} />
              </button>

              {/* Desktop Auth Section */}
              {isAuthenticated ? (
                <div className="hidden md:flex relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c9a47c] text-white hover:bg-[#b8926d] transition"
                    title="Profile"
                  >
                    <FiUser size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-[#eadfda] w-48 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 text-left text-[#7b5a45] font-slab hover:bg-[#f6efe6] transition flex items-center gap-2"
                      >
                        <FiUser size={16} />
                        My Profile
                      </button>
                      <div className="border-t border-[#eadfda]" />
                      <button
                        onClick={handleOrdersClick}
                        className="w-full px-4 py-3 text-left text-[#7b5a45] font-slab hover:bg-[#f6efe6] transition flex items-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        My Orders
                      </button>
                      <div className="border-t border-[#eadfda]" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-600 font-slab hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:flex items-center gap-2 border border-amber-900
                  text-amber-900 px-4 py-2 rounded-lg font-slab text-sm
                  hover:bg-amber-900 hover:text-white transition"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-amber-900 hover:text-amber-700"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4 border-t-2 font-slab border-amber-900">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 ${
                      isActive
                        ? "text-amber-900 font-semibold bg-amber-200"
                        : "text-gray-600 hover:text-amber-700 hover:bg-amber-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      handleProfileClick();
                      setIsOpen(false);
                    }}
                    className="block w-[calc(100%-2rem)] mx-4 mt-3 text-center text-amber-900 border border-amber-900 py-2 rounded-lg font-slab hover:bg-amber-100 transition"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      handleOrdersClick();
                      setIsOpen(false);
                    }}
                    className="block w-[calc(100%-2rem)] mx-4 mt-2 text-center text-amber-900 border border-amber-900 py-2 rounded-lg font-slab hover:bg-amber-100 transition"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-[calc(100%-2rem)] mx-4 mt-2 text-center text-red-600 border border-red-600 py-2 rounded-lg font-slab hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setIsOpen(false);
                  }}
                  className="block w-[calc(100%-2rem)] mx-4 mt-3
                  text-center border border-amber-900 text-amber-900
                  py-2 rounded-lg font-slab
                  hover:bg-amber-900 hover:text-white transition"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}