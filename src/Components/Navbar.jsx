import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { FiUser } from "react-icons/fi";

import AuthModal from "./AuthModal";
import { logout } from "../Redux/authSlice";
import { setCartCount, resetCartCount } from "../Redux/cartSlice";
import {
  setWishlistCount,
  resetWishlist,
} from "../Redux/wishlistSlice";

// RTK Query
import { useGetCartDetailsQuery } from "../Services/cartApi";
import { useGetGuestCartDetailsQuery } from "../Services/guestCartApi";
import { useGetWishlistCountQuery } from "../Services/wishlistApi";

// Utils
import { getGuestSessionId, clearGuestSession } from "../utils/session";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.itemCount);
  const wishlistCount = useSelector((state) => state.wishlist.itemCount);

  /* =========================
     CART (USER / GUEST)
  ========================== */
  const sessionId = getGuestSessionId();

  const { data: userCart } = useGetCartDetailsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: guestCart } = useGetGuestCartDetailsQuery(sessionId, {
    skip: isAuthenticated,
  });

  /* =========================
     WISHLIST COUNT
  ========================== */
  const { data: wishlistData } = useGetWishlistCountQuery(undefined, {
    skip: !isAuthenticated,
  });

  /* =========================
     SYNC CART BADGE
  ========================== */
  useEffect(() => {
    if (isAuthenticated && userCart?.items) {
      dispatch(setCartCount(userCart.items.length));
    }

    if (!isAuthenticated && guestCart?.items) {
      dispatch(setCartCount(guestCart.items.length));
    }
  }, [isAuthenticated, userCart, guestCart, dispatch]);

  /* =========================
     SYNC WISHLIST BADGE
  ========================== */
  useEffect(() => {
    if (wishlistData?.count !== undefined) {
      dispatch(setWishlistCount(wishlistData.count));
    }
  }, [wishlistData, dispatch]);

  /* =========================
     UI STATE
  ========================== */
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const profileDropdownRef = useRef(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: "About us", href: "/about" },
    { label: "Contact US", href: "/contact" },
  ];

  /* =========================
     CLICK OUTSIDE TO CLOSE DROPDOWN
  ========================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdown(false);
      }
    };

    if (profileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdown]);

  /* =========================
     LOGOUT HANDLER
  ========================== */
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCartCount());
    dispatch(resetWishlist());

    clearGuestSession();
    setProfileDropdown(false);
    navigate("/");
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
              <div className="border border-amber-900 rounded-xl px-8 py-2 flex gap-12 font-slab">
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
              <Search size={24} className="text-amber-900" />

              {/* WISHLIST */}
              <button
                onClick={() => navigate("/wishlist")}
                className="relative text-amber-900"
              >
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="relative text-amber-900"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* AUTH */}
              {isAuthenticated ? (
                <div className="relative hidden md:block z-50" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c9a47c] text-white"
                  >
                    <FiUser size={20} />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border w-48">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-[#f6efe6] flex items-center gap-2"
                      >
                        <FiUser size={16} /> My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/orders");
                          setProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-[#f6efe6] flex items-center gap-2"
                      >
                        <ShoppingBag size={16} /> My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:flex border border-amber-900 text-amber-900 px-4 py-2 rounded-lg"
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

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-[#eae5d7] border-t border-amber-900/20">
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-slab transition-colors ${
                    isActive
                      ? "bg-amber-900 text-white font-semibold"
                      : "text-gray-700 hover:bg-amber-900/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Divider */}
            <div className="border-t border-amber-900/20 my-2"></div>

            {/* Profile Section */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-900/10 transition-colors"
                >
                  <FiUser size={18} />
                  <span className="font-slab">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-900/10 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span className="font-slab">My Orders</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-slab">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthOpen(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 bg-amber-900 text-white rounded-lg font-slab hover:bg-amber-800 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
