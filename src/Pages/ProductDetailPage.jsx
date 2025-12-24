import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchAllProducts } from "../Redux/productSlice";
import { addToCart } from "../Redux/cartSlice";
import { useEffect, useState } from "react";
import Toast from "../Components/Toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux selectors
  const { currentProduct: product, loading, error } = useSelector(state => state.product);
  const { products } = useSelector(state => state.product);

  // Local state
  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("khaki");
  const [selectedSize, setSelectedSize] = useState("8");
  const [notification, setNotification] = useState(null);

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // Fetch all products for related items
  useEffect(() => {
    if (!products.data || products.data.length === 0) {
      dispatch(fetchAllProducts({ page: 1, limit: 20 }));
    }
  }, [dispatch, products.data]);

  // Set main image when product loads
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    } else if (product?.image) {
      setMainImage(product.image);
    }
  }, [product]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A4A]"></div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 max-w-md">
          <p className="font-semibold mb-2">Error Loading Product</p>
          <p>{error || "Product not found"}</p>
          <Link to="/products" className="text-red-600 hover:text-red-800 mt-4 inline-block">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const brand = product.brand || "Mahaveer Petals";
  const originalPrice = product.originalPrice || product.price * 1.2;
  const currentPrice = product.price;
  const productImages = product.images || [product.image];

  const colors = product.colors || [
    { name: "Royal Brown", code: "#8B4513" },
    { name: "Khaki", code: "#F0E68C" },
    { name: "White", code: "#FFFFFF" },
    { name: "Navy", code: "#000080" },
    { name: "Black", code: "#000000" },
  ];

  const sizes = product.sizes || ["8", "10", "14", "18", "20"];

  // Get related products - filter by same category or just exclude current
  const relatedProducts = (products.data || [])
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  return (
    <div
      className="min-h-screen py-12 relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/ProdBgImg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 p-3">
          <Link to="/" className="hover:text-[#8B3A4A]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-[#8B3A4A]">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
          {/* Images */}
          <div className="space-y-4">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl border border-gray-200"
              />
            )}
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} view ${index + 1}`}
                  onClick={() => setMainImage(img)}
                  className={`w-full h-20 object-cover rounded cursor-pointer border transition ${
                    mainImage === img
                      ? "border-[#8B3A4A] border-2"
                      : "border-gray-300 hover:border-[#C48B9F]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <p className="text-sm text-gray-500">{brand}</p>
            <h1 className="text-3xl font-semibold text-gray-800">
              {product.name}
            </h1>

            {/* Rating (if available) */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(Math.floor(product.rating))].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div>
              <span className="text-3xl font-bold text-[#8B3A4A]">
                ₹{currentPrice.toFixed(2)}
              </span>
              {originalPrice > currentPrice && (
                <>
                  <span className="ml-2 text-lg text-gray-400 line-through">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <p className="text-sm text-green-600 mt-1">
                    Save ₹{(originalPrice - currentPrice).toFixed(2)} ({Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% off)
                  </p>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || "Premium quality product"}
            </p>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-3">
                  Color: <span className="text-[#8B3A4A]">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === c.name
                          ? "border-[#8B3A4A] scale-110"
                          : "border-gray-300 hover:border-[#C48B9F]"
                      }`}
                      style={{ backgroundColor: c.code }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-3">
                  Size: <span className="text-[#8B3A4A]">{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s.toString())}
                      className={`px-4 py-2 rounded border transition ${
                        selectedSize === s.toString()
                          ? "bg-[#8B3A4A] text-white border-[#8B3A4A]"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:border-[#C48B9F]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  dispatch(addToCart({
                    ...product,
                    selectedColor,
                    selectedSize,
                    quantity: 1
                  }));
                  showNotification("Added to cart successfully!");
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-[#8B3A4A] text-white py-3 rounded-lg hover:bg-[#6B2A3A] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add To Cart
              </button>
              <button className="flex-1 border-2 border-[#8B3A4A] text-[#8B3A4A] py-3 rounded-lg hover:bg-[#8B3A4A] hover:text-white transition">
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
              <p>✓ Free shipping on orders above ₹500</p>
              <p>✓ 7 days easy return policy</p>
              <p>✓ Authentic products guaranteed</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  to={`/products/${rel._id}`}
                  key={rel._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src={rel.image || rel.images?.[0]}
                      alt={rel.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {rel.name}
                  </h3>
                  <p className="text-[#8B3A4A] font-semibold mt-2">
                    ₹{rel.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
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

export default ProductDetailsPage;