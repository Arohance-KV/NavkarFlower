// src/Pages/CartPage.jsx
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaTag, FaTimes } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import Toast from "../Components/Toast";

// ==========================
// Redux Actions
// ==========================
import { setCartCount } from "../Redux/cartSlice";

// ==========================
// RTK Query – USER CART
// ==========================
import {
  useGetCartDetailsQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyDiscountMutation,
  useRemoveDiscountMutation,
} from "../Services/cartApi";

// ==========================
// RTK Query – GUEST CART
// ==========================
import {
  useGetGuestCartDetailsQuery,
  useUpdateGuestCartItemMutation,
  useRemoveGuestCartItemMutation,
  useApplyGuestDiscountMutation,
  useRemoveGuestDiscountMutation,
} from "../Services/guestCartApi";

import { getGuestSessionId } from "../utils/session";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const sessionId = getGuestSessionId();

  const [notification, setNotification] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // ==========================
  // USER CART
  // ==========================
  const {
    data: userCart,
    isLoading: userLoading,
  } = useGetCartDetailsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateUserItem] = useUpdateCartItemMutation();
  const [removeUserItem] = useRemoveCartItemMutation();
  const [applyUserDiscount] = useApplyDiscountMutation();
  const [removeUserDiscount] = useRemoveDiscountMutation();

  // ==========================
  // GUEST CART
  // ==========================
  const {
    data: guestCart,
    isLoading: guestLoading,
  } = useGetGuestCartDetailsQuery(sessionId, {
    skip: isAuthenticated,
  });

  const [updateGuestItem] = useUpdateGuestCartItemMutation();
  const [removeGuestItem] = useRemoveGuestCartItemMutation();
  const [applyGuestDiscount] = useApplyGuestDiscountMutation();
  const [removeGuestDiscount] = useRemoveGuestDiscountMutation();

  // ==========================
  // DERIVED DATA
  // ==========================
  const items = isAuthenticated
    ? userCart?.items || []
    : guestCart?.items || [];

  const totals = isAuthenticated
    ? userCart?.totals || {}
    : guestCart?.totals || {};

  // Debug: Log cart data to see structure
  console.log("Cart Data:", isAuthenticated ? userCart : guestCart);
  console.log("Totals:", totals);

  // Check for applied coupons - handle different possible field names
  const appliedCoupons = totals.appliedCoupons ||
                         totals.appliedDiscounts ||
                         (totals.couponCode ? [{ code: totals.couponCode }] : []) ||
                         [];

  const hasAppliedCoupon = appliedCoupons.length > 0 ||
                          totals.discount > 0 ||
                          !!totals.couponCode;

  // ==========================
  // NOTIFICATION HELPER
  // ==========================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==========================
  // HANDLERS
  // ==========================
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      if (isAuthenticated) {
        await updateUserItem({
          itemId,
          updates: { quantity },
        }).unwrap();
      } else {
        await updateGuestItem({
          sessionId,
          itemId,
          payload: { quantity },
        }).unwrap();
      }
      showNotification("Cart updated");
    } catch (error) {
      showNotification("Failed to update cart", "error");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (isAuthenticated) {
        await removeUserItem(itemId).unwrap();
      } else {
        await removeGuestItem({ sessionId, itemId }).unwrap();
      }

      // Update cart count in Redux
      const newCount = items.length - 1;
      dispatch(setCartCount(newCount));

      showNotification("Item removed from cart", "info");
    } catch (error) {
      showNotification("Failed to remove item", "error");
    }
  };

  // ==========================
  // APPLY COUPON/DISCOUNT
  // ==========================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showNotification("Please enter a coupon code", "error");
      return;
    }

    setApplyingCoupon(true);
    try {
      if (isAuthenticated) {
        await applyUserDiscount({
          code: couponCode,
          type: "coupon",
        }).unwrap();
      } else {
        await applyGuestDiscount({
          sessionId,
          payload: {
            code: couponCode,
            type: "coupon",
          },
        }).unwrap();
      }

      showNotification("Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      const errorMessage = error?.data?.message || "Invalid or expired coupon code";
      showNotification(errorMessage, "error");
    } finally {
      setApplyingCoupon(false);
    }
  };

  // ==========================
  // REMOVE COUPON/DISCOUNT
  // ==========================
  const handleRemoveCoupon = async () => {
    try {
      if (isAuthenticated) {
        await removeUserDiscount({ type: "all" }).unwrap();
      } else {
        await removeGuestDiscount({
          sessionId,
          payload: { type: "all" },
        }).unwrap();
      }

      showNotification("Coupon removed", "info");
    } catch (error) {
      showNotification("Failed to remove coupon", "error");
    }
  };

  // ==========================
  // PROCEED TO CHECKOUT
  // ==========================
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showNotification("Please login to continue", "error");
      return;
    }

    if (items.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    // Navigate to checkout with cart data
    navigate("/checkout", {
      state: {
        fromCart: true,
        items: items,
        totals: totals,
      },
    });
  };

  // ==========================
  // LOADING STATES
  // ==========================
  if (userLoading || guestLoading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center relative font-slab"
        style={{
          backgroundImage: `url('./assets/ProdBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10">
          <FiLoader className="animate-spin text-[#8B3A4A]" size={40} />
        </div>
      </div>
    );
  }

  // ==========================
  // EMPTY CART STATE
  // ==========================
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen py-12 relative font-slab"
        style={{
          backgroundImage: `url('./assets/ProdBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-600">
              <Link to="/" className="text-[#8B3A4A] hover:underline">
                Home
              </Link>{" "}
              / Cart
            </p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white/90 rounded-3xl shadow-lg p-12 text-center max-w-md">
              <FaShoppingBag className="mx-auto text-[#C48B9F] mb-6" size={80} />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/product"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // CART WITH ITEMS
  // ==========================
  return (
    <div
      className="min-h-screen py-12 relative font-slab"
      style={{
        backgroundImage: `url('./assets/ProdBgImg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-600">
            <Link to="/" className="text-[#8B3A4A] hover:underline">
              Home
            </Link>{" "}
            / Cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/90 rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Cart Items ({items.length})
              </h2>

              <div className="space-y-4">
                {items.map((item) => {
                  const product = item.product || item;
                  const itemId = item._id;
                  const quantity = item.quantity;
                  const size = item.size;
                  const color = item.color;
                  const selectedImage = item.selectedImage;

                  return (
                    <div
                      key={itemId}
                      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        {/* Product Image */}
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={selectedImage || product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-full sm:w-32 h-32 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/products/${product._id}`}
                              className="block"
                            >
                              <h3 className="text-lg font-semibold text-gray-800 hover:text-[#8B3A4A] transition-colors mb-2">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              {size && (
                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                  Size: {size}
                                </span>
                              )}
                              {color && (
                                <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                  Color: {color.colorName}
                                  {color.colorHex && (
                                    <span
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color.colorHex }}
                                    ></span>
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-[#8B3A4A]">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls & Remove Button */}
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-white border-2 border-[#8B3A4A] rounded-full overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(itemId, quantity - 1)
                                }
                                disabled={quantity <= 1}
                                className="p-2 hover:bg-[#8B3A4A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="px-4 font-medium text-[#8B3A4A] min-w-[40px] text-center">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(itemId, quantity + 1)
                                }
                                className="p-2 hover:bg-[#8B3A4A] hover:text-white transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(itemId)}
                              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                            >
                              <FaTrash size={14} />
                              <span className="text-sm font-medium">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 text-[#8B3A4A] font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-[#8B3A4A]"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 rounded-xl p-6 shadow-md sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaTag className="text-[#8B3A4A]" />
                  Have a Coupon Code?
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === "Enter" && !hasAppliedCoupon && handleApplyCoupon()}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B3A4A] text-sm"
                    disabled={applyingCoupon || hasAppliedCoupon}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim() || hasAppliedCoupon}
                    className="px-6 py-2 bg-[#8B3A4A] text-white text-sm font-medium rounded-full hover:bg-[#C48B9F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>

                {/* Display Applied Coupon */}
                {hasAppliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-full px-4 py-2">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-green-600" size={12} />
                      <span className="text-sm font-medium text-green-700">
                        {appliedCoupons[0]?.code || totals.couponCode || "Discount Applied"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove coupon"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₹{totals.subtotal?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaTag size={12} />
                      <span className="font-medium">Discount Savings</span>
                    </div>
                    <span className="font-bold">
                      -₹{totals.discount?.toFixed(2)}
                    </span>
                  </div>
                )}

                {totals.tax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">
                      ₹{totals.tax?.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {totals.shipping > 0
                      ? `₹${totals.shipping?.toFixed(2)}`
                      : "FREE"}
                  </span>
                </div>

                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-[#8B3A4A]">
                    <span>Total</span>
                    <span>₹{totals.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-medium rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 mb-3"
              >
                Proceed to Checkout
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CartPage;
