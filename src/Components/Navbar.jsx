import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { FiUser } from "react-icons/fi";
import AuthModal from "./AuthModal";
import { logout } from "../Redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  /* 🔥 CART STATE */
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems?.length || 0;

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
      <nav className="w-full bg-[#eae5d7] shadow-md">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <NavLink to="/" className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="NAKAR Logo"
                className="h-16 w-auto cursor-pointer"
              />
            </NavLink>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-8">
              <div className="border border-amber-900 rounded-xl [corner-shape:scoop] px-8 py-2 flex gap-12 font-slab">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    className={({ isActive }) =>
                      `transition-colors ${
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

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-6">
              <button className="text-amber-900 hover:text-amber-700 transition">
                <Search size={24} />
              </button>

              {/* 🛒 CART ICON */}
              <button
                onClick={() => navigate("/cart")}
                className="relative text-amber-900 hover:text-amber-700 transition"
              >
                <ShoppingCart size={24} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* AUTH SECTION */}
              {isAuthenticated ? (
                <div className="hidden md:flex relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c9a47c] text-white hover:bg-[#b8926d]"
                  >
                    <FiUser size={20} />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border w-48 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 text-left hover:bg-[#f6efe6] flex gap-2"
                      >
                        <FiUser size={16} /> My Profile
                      </button>

                      <button
                        onClick={handleOrdersClick}
                        className="w-full px-4 py-3 text-left hover:bg-[#f6efe6] flex gap-2"
                      >
                        <ShoppingBag size={16} /> My Orders
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:flex border border-amber-900 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-900 hover:text-white"
                >
                  Login
                </button>
              )}

              {/* MOBILE MENU */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-amber-900"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* AUTH MODAL */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
