// src/Pages/ProductPage.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import Toast from "../Components/Toast";

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
import { useAddToCartMutation } from "../Services/cartApi";
import { useAddGuestCartItemMutation } from "../Services/guestCartApi";

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

  const isSearching = searchQuery.trim().length > 0;
  const isCategorySelected = selectedCategory !== "All Flowers";

  // ==========================
  // RTK QUERY – PRODUCTS
  // ==========================
  const { data: allProductsData, isLoading: loadingAll } =
    useGetAllProductsQuery(undefined, {
      skip: isSearching || isCategorySelected,
    });

  const { data: searchData, isLoading: loadingSearch } = useSearchProductsQuery(
    { query: searchQuery },
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

  // Apply sorting client-side
  let filteredProducts = [...rawProducts];

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
      return wishlistData.items.map((item) => item.product._id);
    }
    return [];
  }, [wishlistData]);

  // ==========================
  // RTK QUERY – CART MUTATIONS
  // ==========================
  const [addToCart] = useAddToCartMutation();
  const [addGuestCartItem] = useAddGuestCartItemMutation();
  const sessionId = getGuestSessionId();

  // ==========================
  // UI HELPERS
  // ==========================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const handleFilter = () => {
    setCurrentPage(1);
    // Additional filter logic can be added here if needed
  };

  // ==========================
  // WISHLIST HANDLER
  // ==========================
  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showNotification("Please login to add items to wishlist", "error");
      return;
    }

    try {
      const isCurrentlyInWishlist = isInWishlist(product._id);

      await toggleWishlist({
        productId: product._id,
        priceWhenAdded: product.price,
      }).unwrap();

      // Optimistic update will be handled by the query refetch
      if (isCurrentlyInWishlist) {
        showNotification("Removed from wishlist");
      } else {
        showNotification("Added to wishlist ❤️");
      }
    } catch {
      showNotification("Failed to update wishlist", "error");
    }
  };

  // ==========================
  // ADD TO CART – FIXED WITH INSTANT BADGE UPDATE
  // ==========================
  const handleAddToCart = async (product) => {
    try {
      if (isAuthenticated) {
        await addToCart({
          productId: product._id,
          quantity: 1,
        }).unwrap();
      } else {
        await addGuestCartItem({
          sessionId,
          product: product._id,
          quantity: 1,
          size: "M",
          color: {
            colorName: "Default",
            colorHex: "#000000",
          },
          selectedImage: product.images?.[0] || product.image,
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
              placeholder="Search products"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B3A4A]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
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
          <button
            onClick={handleFilter}
            className="px-6 py-2 bg-[#C48B9F] text-white rounded-full hover:bg-[#8B3A4A] transition flex shrink-0"
          >
            Filter
          </button>
        </div>

        {/* PRODUCT GRID */}
        <div className="mb-8">
          {loading ? (
            <div className="min-h-screen flex items-top justify-center">
              <FiLoader className="animate-spin text-[#c9a47c]" size={40} />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products found matching your criteria.
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
                        className="absolute top-2 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300 z-10"
                      >
                        <span
                          className={`text-xl transition-colors ${
                            isInWishlist(product._id)
                              ? "text-red-500"
                              : "text-white"
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

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="flex shrink-0 px-5 py-2.5 bg-linear-to-r from-[#C48B9F] to-[#8B3A4A] text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                          >
                            Add to Cart
                          </button>
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
