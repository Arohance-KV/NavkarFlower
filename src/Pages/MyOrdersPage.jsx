import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Package, Clock, CheckCircle, XCircle } from "lucide-react";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  /* -----------------------------
     Auth Guard
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate("/");
    }
  }, [isAuthenticated, accessToken, navigate]);

  // TODO: Replace with actual orders from API
  const orders = [];

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

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
            My Orders
          </h1>
          <p className="text-sm text-gray-600">
            <Link to="/" className="text-[#8B3A4A] hover:underline">
              Home
            </Link>{" "}
            / Orders
          </p>
        </div>

        {/* Orders Content */}
        <div className="bg-white/90 rounded-xl shadow-md p-8">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C48B9F] to-[#8B3A4A] flex items-center justify-center">
                  <ShoppingBag size={48} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <button
                onClick={() => navigate("/product")}
                className="px-8 py-3 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   Order Card Component
------------------------------ */
const OrderCard = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "processing":
        return <Package className="text-blue-600" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-600" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{order.orderNumber || order._id?.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusIcon(order.status)}
          <span className="text-sm font-semibold capitalize">
            {order.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {order.items?.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              src={item.product?.image || "/assets/placeholder.png"}
              alt={item.product?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {item.product?.name}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} x Rs. {item.price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                Rs. {item.quantity * item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Delivery Address: {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.state}
        </p>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-[#8B3A4A]">
            Rs. {order.totalAmount}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all">
          View Details
        </button>
        {order.status.toLowerCase() === "pending" && (
          <button className="flex-1 py-2 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-all">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
