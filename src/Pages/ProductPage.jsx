// src/Pages/ProductPage.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { FaHeart, FaRegHeart, FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import Toast from "../Components/Toast";
import { useDebounce } from "../hooks/useDebounce";

// ==========================
// Redux Actions
// ==========================
import { setCartCount } from "../Redux/cartSlice"; // Added

// ==========================
// RTK Query – Products
// ==========================
import {
  useGetAllProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} from "../Services/productApi";

// ==========================
// RTK Query – Categories
// ==========================
import { useGetAllCategoriesQuery } from "../Services/categoryApi";

// ==========================
// RTK Query – Cart (USER + GUEST)
// ==========================
import {
  useAddToCartMutation,
  useGetCartDetailsQuery,
  useUpdateCartItemMutation,
} from "../Services/cartApi";
import {
  useAddGuestCartItemMutation,
  useGetGuestCartDetailsQuery,
  useUpdateGuestCartItemMutation,
} from "../Services/guestCartApi";

// ==========================
// RTK Query – Wishlist
// ==========================
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../Services/wishlistApi";

// ==========================
// Utils
// ==========================
import { getGuestSessionId } from "../utils/session";

const ProductPage = () => {
  // ==========================
  // REDUX
  // ==========================
  const dispatch = useDispatch(); // Added
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.itemCount); // To use in optimistic update

  // ==========================
  // LOCAL UI STATE
  // ==========================
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Flowers");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("best-selling");
  const [optimisticWishlist, setOptimisticWishlist] = useState(new Set());

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const isSearching = debouncedSearchQuery.trim().length > 0;
  const isCategorySelected = selectedCategory !== "All Flowers";

  // ==========================
  // RTK QUERY – PRODUCTS
  // ==========================
  const { data: allProductsData, isLoading: loadingAll } =
    useGetAllProductsQuery(undefined, {
      skip: isSearching || isCategorySelected,
    });

  const { data: searchData, isLoading: loadingSearch } = useSearchProductsQuery(
    { query: debouncedSearchQuery },
    { skip: !isSearching }
  );

  const { data: categoryData, isLoading: loadingCategory } =
    useGetProductsByCategoryQuery(
      { category: selectedCategory },
      { skip: !isCategorySelected || isSearching }
    );

  // Normalize data to ensure it's an array
  const getProductArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.products || data.data || [];
  };

  const rawProducts = getProductArray(
    searchData || categoryData || allProductsData
  );

  // Apply client-side filtering and sorting
  let filteredProducts = [...rawProducts];

  // If searching, filter by product name only
  if (isSearching && debouncedSearchQuery.trim()) {
    const searchTerm = debouncedSearchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  // For "best-selling", no additional sorting (assume server-side or default)

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loading = loadingAll || loadingSearch || loadingCategory;

  // ==========================
  // RTK QUERY – CATEGORIES
  // ==========================
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const categories = [
    { name: "All Flowers" },
    ...(Array.isArray(categoriesData)
      ? categoriesData.map((cat) => ({ name: cat.name }))
      : []),
  ];

  // ==========================
  // RTK QUERY – WISHLIST
  // ==========================
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [toggleWishlist] = useToggleWishlistMutation();

  // ==========================
  // DERIVE WISHLIST IDS
  // ==========================
  const wishlistIds = useMemo(() => {
    if (wishlistData?.items) {
      // Handle both cases: product as string ID or product as object
      const ids = wishlistData.items.map((item) =>
        typeof item.product === "string" ? item.product : item.product._id
      );
      console.log("Wishlist Product IDs:", ids);
      return ids;
    }
    return [];
  }, [wishlistData]);

  // ==========================
  // RTK QUERY – CART QUERIES & MUTATIONS
  // ==========================
  const [addToCart] = useAddToCartMutation();
  const [addGuestCartItem] = useAddGuestCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [updateGuestCartItem] = useUpdateGuestCartItemMutation();
  const sessionId = getGuestSessionId();

  // Fetch cart details based on authentication
  const { data: userCartData } = useGetCartDetailsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: guestCartData } = useGetGuestCartDetailsQuery(sessionId, {
    skip: isAuthenticated,
  });

  const cartData = isAuthenticated ? userCartData : guestCartData;

  // ==========================
  // UI HELPERS
  // ==========================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const isInWishlist = (productId) => {
    // Check optimistic updates first
    if (optimisticWishlist.has(productId)) {
      // If in optimistic set, it means we're toggling, so return opposite of current state
      return !wishlistIds.includes(productId);
    }
    // Otherwise return actual state
    return wishlistIds.includes(productId);
  };

  // Helper function to get cart item details for a product
  const getCartItem = (productId) => {
    if (!cartData?.items) return null;
    return cartData.items.find(
      (item) => item.product._id === productId || item.product === productId
    );
  };

  const handleFilter = () => {
    // Reset to first page when applying filters
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Flowers");
    setSortBy("best-selling");
    setCurrentPage(1);
  };

  // ==========================
  // WISHLIST HANDLER
  // ==========================
  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showNotification("Please login to add items to wishlist", "error");
      return;
    }

    const productId = product._id;
    const isCurrentlyInWishlist = wishlistIds.includes(productId);

    // Optimistic update - immediately update UI
    setOptimisticWishlist((prev) => {
      const newSet = new Set(prev);
      newSet.add(productId);
      return newSet;
    });

    try {
      await toggleWishlist({
        productId: productId,
        priceWhenAdded: product.price,
      }).unwrap();

      // Show success notification
      if (isCurrentlyInWishlist) {
        showNotification("Removed from wishlist");
      } else {
        showNotification("Added to wishlist ❤️");
      }
    } catch (error) {
      // Revert optimistic update on error
      showNotification("Failed to update wishlist", "error");
    } finally {
      // Remove from optimistic set after API call completes
      // Small delay to allow cache to update
      setTimeout(() => {
        setOptimisticWishlist((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }, 100);
    }
  };

  // ==========================
  // ADD TO CART – FIXED WITH INSTANT BADGE UPDATE
  // ==========================
  const handleAddToCart = async (product) => {
    console.log("Adding to cart:", product);
    try {
      if (isAuthenticated) {
        await addToCart({
          productId: product._id,
          quantity: 1,
          size: "M",
          color: {
            colorName: product.colors?.[0]?.colorName || "Default",
            colorHex: product.colors?.[0]?.colorHex || "#000000",
          },
          selectedImage: product.colors[0].images[0] || product.image,
        }).unwrap();
      } else {
        await addGuestCartItem({
          sessionId,
          payload: {
            product: product._id,
            quantity: 1,
            size: "M",
            color: {
              colorName: product.colors?.[0]?.colorName || "Default",
              colorHex: product.colors?.[0]?.colorHex || "#000000",
            },
            selectedImage: product.colors[0].images[0] || product.image,
          },
        }).unwrap();
      }

      // Optimistically update cart count for instant badge reflection in Navbar
      dispatch(setCartCount(cartCount + 1));

      showNotification("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showNotification("Failed to add to cart", "error");
    }
  };

  // ==========================
  // INCREMENT CART ITEM QUANTITY
  // ==========================
  const handleIncrement = async (cartItem) => {
    try {
      const newQuantity = cartItem.quantity + 1;

      if (isAuthenticated) {
        await updateCartItem({
          itemId: cartItem._id,
          updates: { quantity: newQuantity },
        }).unwrap();
      } else {
        await updateGuestCartItem({
          sessionId,
          itemId: cartItem._id,
          payload: { quantity: newQuantity },
        }).unwrap();
      }

      showNotification("Cart updated");
    } catch (error) {
      console.error("Failed to increment:", error);
      showNotification("Failed to update cart", "error");
    }
  };

  // ==========================
  // DECREMENT CART ITEM QUANTITY
  // ==========================
  const handleDecrement = async (cartItem) => {
    try {
      const newQuantity = cartItem.quantity - 1;

      if (newQuantity < 1) {
        showNotification("Quantity cannot be less than 1", "error");
        return;
      }

      if (isAuthenticated) {
        await updateCartItem({
          itemId: cartItem._id,
          updates: { quantity: newQuantity },
        }).unwrap();
      } else {
        await updateGuestCartItem({
          sessionId,
          itemId: cartItem._id,
          payload: { quantity: newQuantity },
        }).unwrap();
      }

      showNotification("Cart updated");
    } catch (error) {
      console.error("Failed to decrement:", error);
      showNotification("Failed to update cart", "error");
    }
  };

  // ==========================
  // RENDER
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
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2">
            Our Products
          </h1>
          <p className="text-sm text-gray-600">
            <Link to="/" className="text-[#8B3A4A] hover:underline">
              Home
            </Link>{" "}
            / Products
          </p>
        </div>

        {/* ACTIVE FILTERS DISPLAY */}
        {(isSearching || isCategorySelected || sortBy !== "best-selling") && (
          <div className="bg-white/90 border-2 border-[#C48B9F]/30 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#8B3A4A]">Active Filters:</span>
              {isSearching && (
                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-[#C48B9F]/20 to-[#8B3A4A]/20 text-[#8B3A4A] border border-[#C48B9F]/40 rounded-full text-xs font-medium">
                  🔍 Search: "{debouncedSearchQuery}"
                </span>
              )}
              {isCategorySelected && (
                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-[#C48B9F]/20 to-[#8B3A4A]/20 text-[#8B3A4A] border border-[#C48B9F]/40 rounded-full text-xs font-medium">
                  📂 Category: {selectedCategory}
                </span>
              )}
              {sortBy !== "best-selling" && (
                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-[#C48B9F]/20 to-[#8B3A4A]/20 text-[#8B3A4A] border border-[#C48B9F]/40 rounded-full text-xs font-medium">
                  📊 Sort: {sortBy === "price-low" ? "Price: Low to High" : "Price: High to Low"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="bg-white/90 p-4 rounded-xl mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="relative min-w-35 flex-1 max-w-xs">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B3A4A] appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </span>
          </div>
          <div className="relative min-w-40 flex-1 max-w-xs">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B3A4A] appearance-none"
            >
              <option value="best-selling">Sort by best selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </span>
          </div>
          {(searchQuery || selectedCategory !== "All Flowers" || sortBy !== "best-selling") && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition flex shrink-0"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div className="mb-8">
          {loading ? (
            <div className="min-h-screen flex items-top justify-center">
              <FiLoader className="animate-spin text-[#c9a47c]" size={40} />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg mb-2">
                {isSearching
                  ? `No products found with name containing "${debouncedSearchQuery}"`
                  : "No products found matching your criteria."}
              </div>
              {isSearching && (
                <p className="text-sm text-gray-500">
                  Try searching with a different product name or clear filters to see all products.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => {
                  const originalPrice = product.originalPrice;
                  const discount = originalPrice
                    ? Math.round(
                        ((originalPrice - product.price) / originalPrice) * 100
                      )
                    : 0;
                  const cartItem = getCartItem(product._id);
                  const isInCart = !!cartItem;

                  return (
                    <div
                      key={product._id}
                      className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-50 relative"
                    >
                      {/* Image Section - Wrapped in Link for navigation */}
                      <Link to={`/products/${product._id}`} className="block">
                        <div className="relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                          <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />

                          {/* Discount Badge */}
                          {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                              {discount}% OFF
                            </div>
                          )}

                          {/* Gradient Overlay on Hover */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300 z-10 shadow-lg ${
                          isInWishlist(product._id)
                            ? "bg-white"
                            : "bg-white/80 backdrop-blur-sm"
                        }`}
                      >
                        <span
                          className={`text-2xl transition-all duration-300 ${
                            isInWishlist(product._id)
                              ? "text-red-500 animate-pulse"
                              : "text-gray-400 hover:text-red-400"
                          }`}
                        >
                          {isInWishlist(product._id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </span>
                      </button>

                      {/* Content Section */}
                      <div className="p-4">
                        <Link to={`/products/${product._id}`} className="block">
                          <h3 className="text-lg text-gray-800 line-clamp-2 min-h-14 leading-snug hover:text-[#8B3A4A] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Price & CTA Section */}
                        <div className="flex items-end justify-between gap-2">
                          <div className="flex flex-col">
                            <div className="flex flex-col items-start gap-2">
                              <span className="text-xl text-[#8B3A4A]">
                                ₹{product.price}/-
                              </span>
                              {originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{originalPrice}/-
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Conditional Rendering: Add to Cart OR Increment/Decrement Controls */}
                          {!isInCart ? (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className="flex shrink-0 px-5 py-2.5 bg-linear-to-r from-[#C48B9F] to-[#8B3A4A] text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-white border-2 border-[#8B3A4A] rounded-full overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleDecrement(cartItem)}
                                className="p-2 hover:bg-[#8B3A4A] hover:text-white transition-colors"
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="px-3 font-medium text-[#8B3A4A]">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleIncrement(cartItem)}
                                className="p-2 hover:bg-[#8B3A4A] hover:text-white transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  {Array.from(
                    { length: Math.min(10, totalPages) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#8B3A4A] text-white shadow-md"
                          : "bg-white/60 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
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

export default ProductPage;
