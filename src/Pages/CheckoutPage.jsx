import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  Plus,
  Check,
  Edit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { FiLoader } from "react-icons/fi";
import Toast from "../Components/Toast";

// RTK Query
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../Services/authApi";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  // Get product data from navigation state
  const checkoutData = location.state;

  /* -----------------------------
     Auth Guard
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/");
    }
    if (!checkoutData) {
      navigate("/product");
    }
  }, [isAuthenticated, accessToken, checkoutData, navigate]);

  /* -----------------------------
     RTK Query - Profile
  ------------------------------ */
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(
    undefined,
    {
      skip: !isAuthenticated || !accessToken,
    }
  );
  const [updateProfile] = useUpdateProfileMutation();

  /* -----------------------------
     Local State
  ------------------------------ */
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notification, setNotification] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    city: "",
    state: "",
    pinCode: "",
  });

  /* -----------------------------
     Helpers
  ------------------------------ */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* -----------------------------
     Address Handlers
  ------------------------------ */
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pinCode
    ) {
      showNotification("Please fill all address fields", "error");
      return;
    }

    try {
      const updatedAddresses = [...(profile?.addresses || []), newAddress];
      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phone,
        addresses: updatedAddresses,
      }).unwrap();

      setSelectedAddressIndex(updatedAddresses.length - 1);
      setIsAddingAddress(false);
      setNewAddress({
        name: "",
        addressLine1: "",
        city: "",
        state: "",
        pinCode: "",
      });
      showNotification("Address added successfully");
    } catch (error) {
      showNotification("Failed to add address", "error");
    }
  };

  /* -----------------------------
     Order Handlers
  ------------------------------ */
  const handlePlaceOrder = async () => {
    if (!profile?.addresses || profile.addresses.length === 0) {
      showNotification("Please add a delivery address", "error");
      return;
    }

    setIsPlacingOrder(true);

    // TODO: Integrate with order API
    // Simulating order placement
    setTimeout(() => {
      setIsPlacingOrder(false);

      // Prepare order data for confirmation page
      const orderConfirmationData = {
        orderId: `ORD${Date.now()}`, // Temporary order ID
        orderDate: new Date().toISOString(),
        items: isFromCart ? cartItems : [
          {
            product: singleProduct,
            selectedImage: selectedImage,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
          }
        ],
        shippingAddress: profile.addresses[selectedAddressIndex],
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        discount: isFromCart ? (cartTotals.discount || 0) : 0,
        total: total,
      };

      // Navigate to order confirmation page
      navigate("/order-confirmation", {
        state: orderConfirmationData,
      });
    }, 2000);
  };

  /* -----------------------------
     Loading
  ------------------------------ */
  if (profileLoading || !checkoutData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url('./assets/ProdBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <FiLoader className="animate-spin text-[#8B3A4A]" size={40} />
      </div>
    );
  }

  /* -----------------------------
     Calculations
  ------------------------------ */
  const isFromCart = checkoutData?.fromCart;
  const cartItems = checkoutData?.items || [];
  const cartTotals = checkoutData?.totals || {};

  // Single product checkout (Buy Now)
  const singleProduct = checkoutData?.product;
  const selectedSize = checkoutData?.selectedSize;
  const selectedColor = checkoutData?.selectedColor;
  const selectedImage = checkoutData?.selectedImage;
  const quantity = checkoutData?.quantity || 1;

  // Calculate totals based on source
  let subtotal, shipping, tax, total;

  if (isFromCart) {
    // Use cart totals
    subtotal = cartTotals.subtotal || 0;
    shipping = cartTotals.shipping || 50;
    tax = cartTotals.tax || Math.round(subtotal * 0.05);
    total = cartTotals.total || subtotal + shipping + tax;
  } else {
    // Calculate for single product
    subtotal = singleProduct?.price * quantity || 0;
    shipping = 50;
    tax = Math.round(subtotal * 0.05);
    total = subtotal + shipping + tax;
  }

  return (
    <div
      className="min-h-screen py-8 font-slab"
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
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(isFromCart ? "/cart" : -1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 text-[#8B3A4A] font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-[#8B3A4A]"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-4xl font-script font-bold text-[#8B3A4A]">
              Checkout
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            <Link to="/" className="text-[#8B3A4A] hover:underline">
              Home
            </Link>{" "}
            / Checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white/90 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="text-[#8B3A4A]" size={24} />
                  Delivery Address
                </h2>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white rounded-full hover:shadow-lg transition-all text-sm"
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                )}
              </div>

              {/* Existing Addresses */}
              {profile?.addresses && profile.addresses.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {profile.addresses.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAddressIndex(index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAddressIndex === index
                          ? "border-[#8B3A4A] bg-[#8B3A4A]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                              selectedAddressIndex === index
                                ? "border-[#8B3A4A] bg-[#8B3A4A]"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAddressIndex === index && (
                              <Check className="text-white" size={14} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {address.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isAddingAddress && (
                  <p className="text-gray-500 text-center py-4">
                    No addresses found. Please add a delivery address.
                  </p>
                )
              )}

              {/* Add New Address Form */}
              {isAddingAddress && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Add New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        placeholder="e.g., Home, Office"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={newAddress.addressLine1}
                        onChange={handleAddressChange}
                        placeholder="Street, Building, etc."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        value={newAddress.pinCode}
                        onChange={handleAddressChange}
                        placeholder="Pin Code"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAddAddress}
                      className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingAddress(false);
                        setNewAddress({
                          name: "",
                          addressLine1: "",
                          city: "",
                          state: "",
                          pinCode: "",
                        });
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white/90 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-[#8B3A4A]" size={24} />
                Payment Method
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#8B3A4A] bg-[#8B3A4A]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "border-[#8B3A4A] bg-[#8B3A4A]"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <Check className="text-white" size={14} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        Pay when you receive the order
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-[#8B3A4A] bg-[#8B3A4A]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "online"
                          ? "border-[#8B3A4A] bg-[#8B3A4A]"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "online" && (
                        <Check className="text-white" size={14} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Online Payment
                      </p>
                      <p className="text-sm text-gray-600">
                        UPI, Cards, Net Banking (Coming Soon)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="text-[#8B3A4A]" size={24} />
                Order Summary
              </h2>

              {/* Product Items */}
              <div className="border-b border-gray-200 pb-4 mb-4 max-h-80 overflow-y-auto">
                {isFromCart ? (
                  // Multiple items from cart
                  <div className="space-y-3">
                    {cartItems.map((item, index) => {
                      const product = item.product || item;
                      return (
                        <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                          <img
                            src={item.selectedImage || product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-xs mb-1">
                              {product.name}
                            </h3>
                            {item.size && (
                              <p className="text-xs text-gray-600">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-xs text-gray-600">
                                Color: {item.color.colorName}
                              </p>
                            )}
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#8B3A4A] text-sm">
                              ₹{product.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{product.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Single product from Buy Now
                  <div className="flex gap-4">
                    <img
                      src={selectedImage || singleProduct?.images?.[0]}
                      alt={singleProduct?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {singleProduct?.name}
                      </h3>
                      <p className="text-xs text-gray-600">Size: {selectedSize}</p>
                      <p className="text-xs text-gray-600">
                        Color: {selectedColor?.colorName}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#8B3A4A]">
                        ₹{singleProduct?.price}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {isFromCart && cartTotals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{cartTotals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `₹${shipping}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#8B3A4A]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  !profile?.addresses ||
                  profile.addresses.length === 0
                }
                className="w-full py-4 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
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

export default CheckoutPage;
