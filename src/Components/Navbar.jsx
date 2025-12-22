import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: "About us", href: "/about" },
    { label: "Contact US", href: "/contact" },
  ];

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
              <button className="text-amber-900 hover:text-amber-700">
                <Search size={24} />
              </button>

              <button className="text-amber-900 hover:text-amber-700">
                <ShoppingCart size={24} />
              </button>

              {/* Login Button (Desktop) */}
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:flex items-center gap-2 border border-amber-900
                text-amber-900 px-4 py-2 rounded-lg font-slab text-sm
                hover:bg-amber-900 hover:text-white transition"
              >
                Login
              </button>

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

              {/* Login Button (Mobile) */}
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
