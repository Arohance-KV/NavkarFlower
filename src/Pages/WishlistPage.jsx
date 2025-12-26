// src/Pages/WishlistPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Toast from "../Components/Toast";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

// ==========================
// Redux Actions
// ==========================
import { setCartCount } from "../Redux/cartSlice";

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
// RTK Query – Products
// ==========================
import { useGetProductByIdQuery } from "../Services/productApi";

// ==========================
// Utils
// ==========================
import { getGuestSessionId } from "../utils/session";

// Product Card Component
const WishlistCard = ({ item, onRemove, onMoveToCart }) => {
  // Check if product is already populated
  let product = null;
  let productId = null;

  if (typeof item.product === "object" && item.product !== null) {
    product = item.product;
    productId = item.product._id;
  } else {
    productId = item.product;
  }

  // Fetch product if only ID is available
  const { data: fetchedProduct, isLoading: productLoading } =
    useGetProductByIdQuery(productId, {
      skip: !!product, // Skip if already have product object
    });

  // Use fetched product if available
  if (!product && fetchedProduct) {
    product = fetchedProduct;
  }

  if (productLoading || !product) {
    return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm p-4 flex items-center gap-6">
        <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex shrink-0" />
        <div className="flex grow space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center p-4 gap-6">
      {/* Image Container */}
      <Link to={`/products/${product._id}`} className="flex shrink-0">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-[#FAF6F0]">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex grow items-center justify-between gap-4">
        <div className="grow">
          {/* Product Name */}
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-[#8B3A4A] transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#8B3A4A]">
              ₹{product.price}/-
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-gray-500 line-through">
                  ₹{product.originalPrice}/-
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onMoveToCart(product)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C48B9F] to-[#8B3A4A] text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            Move to Cart
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(product._id);
            }}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            title="Remove from wishlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.itemCount);
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
      // Debug: Log product structure
      console.log("Moving to cart - Product:", product);

      // Prepare cart item data - matching ProductPage structure
      const colorData = {
        colorName: product.colors?.[0]?.colorName || "Default",
        colorHex: product.colors?.[0]?.colorHex || "#000000",
      };

      const selectedImage =
        product.colors?.[0]?.images?.[0] ||
        product.images?.[0] ||
        product.image ||
        "https://via.placeholder.com/300";

      // Validate required fields
      if (!colorData.colorName || !colorData.colorHex || !selectedImage) {
        showToast("Missing product details. Please try again.", "error");
        return;
      }

      const payload = {
        productId: product._id,
        quantity: 1,
        size: "M",
        color: colorData,
        selectedImage: selectedImage,
      };

      console.log("Cart payload:", payload);
      console.log("Color will be sent as:", {
        colorName: colorData.colorName,
        colorHex: colorData.colorHex,
      });

      if (isAuthenticated) {
        // For authenticated users: moveWishlistItemToCart adds to cart AND removes from wishlist
        await moveWishlistItemToCart(payload).unwrap();

        // Update cart count
        dispatch(setCartCount(cartCount + 1));

        showToast("Moved to cart! Item removed from wishlist 🛒");
      } else {
        // Guest users shouldn't be able to access wishlist, but handle just in case
        await addGuestCartItem({
          sessionId,
          payload: {
            product: product._id,
            quantity: 1,
            size: "M",
            color: colorData,
            selectedImage: selectedImage,
          }
        }).unwrap();

        // Update cart count
        dispatch(setCartCount(cartCount + 1));

        showToast("Added to cart 🛒");
      }
    } catch (error) {
      console.error("Failed to move to cart:", error);
      const errorMessage = error?.data?.message || "Failed to move item to cart";
      showToast(errorMessage, "error");
    }
  };

  // ==========================
  // EMPTY STATE
  // ==========================
  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FAF6F0] via-white to-[#F5EBE0] py-20 font-slab">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-script text-[#8B3A4A] mb-4">
            My Wishlist
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your wishlist is empty. Start adding beautiful blooms you love!
          </p>
          <Link
            to="/product"
            className="inline-block px-10 py-3 bg-linear-to-r from-[#C48B9F] to-[#B89B72] text-white font-semibold rounded-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAF6F0] via-white to-[#F5EBE0] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-script font-semibold text-[#8B3A4A]">
              My Wishlist
              <span className="text-xl font-slab text-gray-500 ml-3">
                ({itemCount} {itemCount === 1 ? "Item" : "Items"})
              </span>
            </h1>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-[#C48B9F] border-t-transparent rounded-full" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 text-lg font-medium">
              Failed to load wishlist
            </p>
          </div>
        )}

        {/* Wishlist Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
                onMoveToCart={handleMoveToCart}
              />
            ))}
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
