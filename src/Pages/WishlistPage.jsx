// src/Pages/WishlistPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Toast from "../Components/Toast";

// ==========================
// RTK Query – Wishlist
// ==========================
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveWishlistItemToCartMutation,
} from "../Services/wishlistApi";

// ==========================
// RTK Query – Cart
// ==========================
import { useAddToCartMutation } from "../Services/cartApi";
import { useAddGuestCartItemMutation } from "../Services/guestCartApi";

// ==========================
// Utils
// ==========================
import { getGuestSessionId } from "../utils/session";

const WishlistPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const sessionId = getGuestSessionId();

  const [notification, setNotification] = useState(null);

  // ==========================
  // FETCH WISHLIST
  // ==========================
  const {
    data: wishlist,
    isLoading,
    error,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const items = wishlist?.items || [];
  const itemCount = items.length;

  // ==========================
  // MUTATIONS
  // ==========================
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveWishlistItemToCart] = useMoveWishlistItemToCartMutation();
  const [addToCart] = useAddToCartMutation();
  const [addGuestCartItem] = useAddGuestCartItemMutation();

  // ==========================
  // HELPERS
  // ==========================
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==========================
  // HANDLERS
  // ==========================
  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    showToast("Removed from wishlist");
  };

  const handleMoveToCart = async (product) => {
    try {
      if (isAuthenticated) {
        await moveWishlistItemToCart({
          productId: product._id,
          quantity: 1,
          size: null,
          colorName: null,
          colorHex: null,
          selectedImage: product.image || product.images?.[0],
        }).unwrap();
      } else {
        await addGuestCartItem({
          sessionId,
          product: product._id,
          quantity: 1,
          size: null,
          color: null,
          selectedImage: product.image || product.images?.[0],
        }).unwrap();
      }

      showToast("Moved to cart 🛒");
    } catch {
      showToast("Failed to move item", "error");
    }
  };

  // ==========================
  // EMPTY STATE (UNCHANGED UI)
  // ==========================
  if (!isLoading && items.length === 0) {
    return (
      <div
        className="min-h-screen py-20 relative"
        style={{
          backgroundImage: `url('./assets/ProdBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-6">
            My Wishlist
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your wishlist is empty. Start adding beautiful blooms you love!
          </p>
          <Link
            to="/product"
            className="inline-block px-10 py-4 bg-[#C48B9F] text-white text-lg font-medium rounded-full hover:bg-[#8B3A4A] transition shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ==========================
  // RENDER (UNCHANGED UI)
  // ==========================
  return (
    <div
      className="min-h-screen py-16 relative"
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-3">
            My Wishlist
          </h1>
          <p className="text-lg text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-b-4 border-[#C48B9F] rounded-full" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-600 text-xl">
            Failed to load wishlist
          </div>
        )}

        {/* Wishlist Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => {
              const product = item.product;

              return (
                <div
                  key={product._id}
                  className="bg-[#FAF6F0] rounded-3xl overflow-hidden border-4 border-[#E8D5D0] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="relative">
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-80 object-cover rounded-t-3xl"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(product._id);
                        }}
                        className="absolute top-4 right-4 text-3xl drop-shadow-md hover:scale-110 transition"
                      >
                        ❤️
                      </button>
                    </div>
                  </Link>

                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-medium text-[#5E8B6E] mb-4">
                      {product.name}
                    </h3>

                    <p className="text-3xl font-bold text-[#5E8B6E] mb-6">
                      ₹{product.price}/-
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="px-8 py-3 bg-[#B89B72] text-white text-lg font-medium rounded-full hover:bg-[#A6845C] transition shadow-md"
                      >
                        Move to Cart
                      </button>

                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-gray-600 hover:text-red-600 text-sm underline transition"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default WishlistPage;
