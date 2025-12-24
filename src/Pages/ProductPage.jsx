// ProductPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, fetchProductsByCategory, searchProducts } from "../Redux/productSlice";
import { Link } from "react-router-dom";
import Toast from "../Components/Toast";

const ProductPage = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const { products, loading, error } = useSelector(state => state.product);
  
  // Local state
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Flowers");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products based on search, category, or all, with pagination
  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchProducts({ query: searchQuery.trim(), page: 1, limit: 9 }));
    } else if (selectedCategory !== "All Flowers") {
      dispatch(fetchProductsByCategory({ category: selectedCategory, page: 1, limit: 9 }));
    } else {
      dispatch(fetchAllProducts({ page: 1, limit: 9 }));
    }
  }, [dispatch, selectedCategory, searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleWishlist = (productId) => {
    const wasInWishlist = wishlist.includes(productId);
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    showNotification(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const addToCart = (productId) => {
    const wasInCart = cart.includes(productId);
    if (!wasInCart) {
      setCart(prev => [...prev, productId]);
      showNotification('Added to cart');
    } else {
      showNotification('Already in cart', 'info');
    }
  };

  const productList = products.data || [];
  const totalPages = products.totalPages || 1;

  const categories = [
    { name: "All Flowers" },
    { name: "Rose" },
    { name: "Sun Flowers" },
    { name: "Blue Flowers" }
  ];

  return (
    <div 
      className="min-h-screen py-12 bg-linear-to-br from-[#FBF3EF] to-[#F5E8E0] relative overflow-hidden"
      style={{
        backgroundImage: `url('./assets/ProdBgImg.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* PAGE HEADER */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-script font-bold text-[#8B3A4A] mb-2 relative">
          Our Products
        </h1>
        <p className="text-sm text-gray-500 font-slab">
          <span className="text-[#8B3A4A]">Home</span> / Products
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* TOP FILTERS BAR */}
        <div className="rounded-xl p-4 mb-8 border border-gray-200/50 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-[#C48B9F] focus:outline-none bg-white/50"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <div className="flex gap-2 flex-1 justify-end">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-full border border-gray-300 bg-white/50 focus:border-[#C48B9F] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select className="px-3 py-2 rounded-full border border-gray-300 bg-white/50 focus:border-[#C48B9F] focus:outline-none">
                <option>Sort by best selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <button className="px-4 py-2 bg-[#C48B9F] text-white rounded-full hover:bg-[#A77A8E] transition">
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* LEFT FILTER SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="p-6 rounded-2xl border border-gray-200/50 shadow-sm">
              <h3 className="font-semibold text-[#8B3A4A] mb-4 text-lg">Categories</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li 
                    key={cat.name} 
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center space-x-3 cursor-pointer group ${selectedCategory === cat.name ? 'text-[#8B3A4A]' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full transition ${selectedCategory === cat.name ? 'bg-[#C48B9F]' : 'bg-gray-300 group-hover:bg-[#C48B9F]'}`}></div>
                    <span className={`text-sm ${selectedCategory === cat.name ? 'font-medium' : 'group-hover:text-[#8B3A4A]'} text-gray-600`}>{cat.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-sm">
              <h3 className="font-semibold text-[#8B3A4A] mb-4 text-lg">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  defaultValue="399"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #C48B9F 0%, #C48B9F 20%, #E5E7EB 20%, #E5E7EB 100%)'
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹0</span>
                  <span>₹2000</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-[#8B3A4A]">₹399</span>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="col-span-3 flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C48B9F]"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="col-span-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p>Error loading products: {error}</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productList.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-xl transition-shadow overflow-hidden group"
                    >
                      <Link
                        to={`/products/${product._id}`}
                        className="block"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product._id);
                            }}
                            className="absolute top-2 right-2 text-amber-700 p-2 rounded-full text-4xl hover:text-amber-900 transition cursor-pointer"
                            aria-label="Add to wishlist"
                          >
                            {isInWishlist(product._id) ? '♥' : '♡'}
                          </button>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="font-medium text-emerald-500 text-sm mb-1">
                              {product.name}
                            </h3>
                            <div className="space-y-1">
                              <p className="text-[#8B3A4A] font-semibold text-lg">
                                ₹{product.price}/-
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product._id);
                            }}
                            className="ml-4 px-4 py-2 bg-[#C48B9F] text-white rounded-full hover:bg-[#A77A8E] transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {productList.length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-sm">
                      <nav className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-full text-sm transition ${
                              page === currentPage
                                ? 'bg-[#C48B9F] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}
              </>
            )}
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

export default ProductPage;