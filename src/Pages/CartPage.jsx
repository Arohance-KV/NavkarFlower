import { useSelector, useDispatch } from "react-redux";
import { fetchCartDetails, removeCartItem, updateCartItem, clearCart } from "../Redux/cartSlice";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "../Components/Toast";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartDetails, loading, error } = useSelector((state) => state.cart);
  const [notification, setNotification] = useState(null);

  // Fetch cart details on mount
  useEffect(() => {
    dispatch(fetchCartDetails());
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
    } else {
      dispatch(updateCartItem({ 
        itemId, 
        updates: { quantity: newQuantity } 
      }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeCartItem(itemId));
    setNotification({ message: 'Item removed from cart', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
      setNotification({ message: 'Cart cleared', type: 'info' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const items = cartDetails?.items || [];
  const totals = cartDetails?.totals || {
    subtotal: 0,
    discountAmount: 0,
    total: 0,
    itemCount: 0,
  };

  // LOADING STATE
  if (loading) {
    return (
      <div
        className="min-h-screen py-12 flex items-center justify-center"
        style={{
          backgroundImage: "url('./assets/ProdBgImg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A4A]"></div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div
        className="min-h-screen py-12"
        style={{
          backgroundImage: "url('./assets/ProdBgImg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center backdrop-blur rounded-xl py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 mb-4">
            <p className="font-semibold">Error Loading Cart</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <Link
            to="/product"
            className="inline-block px-6 py-3 bg-[#8B3A4A] text-white rounded-lg hover:bg-[#6D2C3A] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen py-12"
        style={{
          backgroundImage: "url('./assets/ProdBgImg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center backdrop-blur rounded-xl py-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Your Cart
          </h1>
          <p className="text-gray-600 mb-8">Your cart is empty.</p>
          <Link
            to="/product"
            className="inline-block px-6 py-3 bg-[#8B3A4A] text-white rounded-lg hover:bg-[#6D2C3A] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // CART WITH ITEMS
  return (
    <div
      className="min-h-screen py-12"
      style={{
        backgroundImage: "url('./assets/ProdBgImg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 bg-white/90 backdrop-blur inline-block px-6 py-2 rounded-lg">
          Your Cart ({totals.itemCount} items)
        </h1>

        <div className="space-y-6">
          {items.map((item) => {
            const product = item.product || item;
            const subtotal = product.price * (item.quantity || 1);
            const itemId = item._id || product._id;

            return (
              <div
                key={itemId}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 border border-gray-200/50 hover:shadow-lg transition"
              >
                {/* Product Image */}
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg flex shrink-0"
                />

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[#8B3A4A] font-semibold mt-1">
                    ₹{product.price.toFixed(2)}
                  </p>
                  
                  {/* Selected Attributes */}
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    {item.selectedColor && (
                      <span>Color: <span className="font-medium">{item.selectedColor}</span></span>
                    )}
                    {item.selectedSize && (
                      <span>Size: <span className="font-medium">{item.selectedSize}</span></span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3 border border-gray-300 rounded-lg p-1 bg-gray-50">
                  <button
                    onClick={() =>
                      handleQuantityChange(itemId, (item.quantity || 1) - 1)
                    }
                    className="px-3 py-1 hover:bg-gray-200 transition rounded"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity || 1}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(itemId, (item.quantity || 1) + 1)
                    }
                    className="px-3 py-1 hover:bg-gray-200 transition rounded"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="text-right sm:text-right">
                  <p className="text-lg font-semibold text-[#8B3A4A]">
                    ₹{subtotal.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(itemId)}
                    className="text-red-500 hover:text-red-700 text-sm mt-2 font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Details */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>-₹{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-semibold text-lg text-[#8B3A4A]">
                <span>Total:</span>
                <span>₹{totals.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50 h-fit space-y-3">
            <Link
              to="/checkout"
              className="block w-full text-center py-3 bg-[#8B3A4A] text-white rounded-lg hover:bg-[#6D2C3A] transition font-semibold"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/product"
              className="block w-full text-center py-3 border-2 border-[#8B3A4A] text-[#8B3A4A] rounded-lg hover:bg-[#8B3A4A] hover:text-white transition font-semibold"
            >
              Continue Shopping
            </Link>
            <button
              onClick={handleClearCart}
              className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium border border-red-200"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-gray-200/50">
          <h3 className="font-semibold text-gray-800 mb-4">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-gray-500">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-gray-500">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-medium">Secure Checkout</p>
                <p className="text-gray-500">100% secure payment</p>
              </div>
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

export default CartPage;