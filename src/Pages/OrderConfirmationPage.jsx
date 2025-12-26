import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
  Home,
  FileText,
} from "lucide-react";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Get order data from navigation state
  const orderData = location.state;

  /* -----------------------------
     Auth Guard & Data Check
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    if (!orderData) {
      navigate("/product");
    }
  }, [isAuthenticated, orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const {
    orderId,
    orderDate,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shipping,
    tax,
    discount,
    total,
  } = orderData;

  // Format date
  const formattedDate = orderDate
    ? new Date(orderDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div
      className="min-h-screen py-12 font-slab"
      style={{
        backgroundImage: `url('./assets/ProdBgImg.png')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/60"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-xl animate-bounce">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Thank you for your order
          </p>
          <p className="text-sm text-gray-600">
            We've received your order and will process it shortly
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/90 rounded-xl shadow-md p-8 mb-6">
          {/* Order Info Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Order Details
              </h2>
              <p className="text-sm text-gray-600">
                Order ID:{" "}
                <span className="font-semibold text-[#8B3A4A]">
                  #{orderId || "PENDING"}
                </span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold text-gray-800">{formattedDate}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="text-[#8B3A4A]" size={20} />
              Order Items
            </h3>
            <div className="space-y-3">
              {items?.map((item, index) => {
                const product = item.product || item;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.selectedImage ||
                        product.images?.[0] ||
                        product.image
                      }
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {item.size && (
                          <span className="bg-white px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-white px-2 py-1 rounded flex items-center gap-1">
                            Color: {item.color.colorName}
                            {item.color.colorHex && (
                              <span
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: item.color.colorHex }}
                              ></span>
                            )}
                          </span>
                        )}
                        <span className="bg-white px-2 py-1 rounded">
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#8B3A4A]">
                        ₹{product.price}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-600">
                          Total: ₹{product.price * item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-[#8B3A4A]" size={20} />
              Shipping Address
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-800 mb-1">
                {shippingAddress?.name}
              </p>
              <p className="text-gray-600">{shippingAddress?.addressLine1}</p>
              <p className="text-gray-600">
                {shippingAddress?.city}, {shippingAddress?.state} -{" "}
                {shippingAddress?.pinCode}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-[#8B3A4A]" size={20} />
              Payment Method
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold text-gray-800">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>
              <p className="text-sm text-gray-600">
                {paymentMethod === "cod"
                  ? "Pay when you receive the order"
                  : "Paid successfully"}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-[#8B3A4A]" size={20} />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal?.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>{shipping > 0 ? `₹${shipping}` : "FREE"}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#8B3A4A]">₹{total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-gradient-to-r from-[#C48B9F]/10 to-[#8B3A4A]/10 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            What happens next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Order Confirmation
                </p>
                <p className="text-sm text-gray-600">
                  You'll receive an email confirmation shortly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Order Processing
                </p>
                <p className="text-sm text-gray-600">
                  We'll prepare your items for shipment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Shipping</p>
                <p className="text-sm text-gray-600">
                  Your order will be shipped to your address
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8B3A4A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-800">Delivery</p>
                <p className="text-sm text-gray-600">
                  Receive your order at your doorstep
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ShoppingBag size={20} />
            View My Orders
          </Link>
          <Link
            to="/product"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-[#8B3A4A] font-semibold rounded-xl border-2 border-[#8B3A4A] hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Home size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
