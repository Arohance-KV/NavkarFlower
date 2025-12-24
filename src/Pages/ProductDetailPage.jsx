import { useParams, Link } from "react-router-dom";
import { products } from "../Data/product";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { useState } from "react";
import Toast from "../Components/Toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = products.find((p) => p.id === id);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState("khaki");
  const [selectedSize, setSelectedSize] = useState("8");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  if (!product) return null;

  const brand = product.brand || "John Lewis & Partners";
  const originalPrice = product.originalPrice || 49.0;
  const currentPrice = product.price;

  const colors = product.colors || [
    { name: "Royal Brown", code: "#8B4513" },
    { name: "Khaki", code: "#F0E68C" },
    { name: "White", code: "#FFFFFF" },
    { name: "Navy", code: "#000080" },
    { name: "Black", code: "#000000" },
  ];

  const sizes = product.sizes || [8, 10, 14, 18, 20];

  const relatedProducts = products
    .filter((p) => p.id !== parseInt(id))
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
        <nav className="text-smmb-6 p-3">
          <Link to="/" className="hover:text-[#8B3A4A]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 p-8">
          {/* Images */}
          <div className="space-y-4">
            <img
              src={mainImage}
              className="w-full h-112.5 object-cover rounded-xl border"
            />
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-full h-20 object-cover rounded cursor-pointer border ${
                    mainImage === img
                      ? "border-[#8B3A4A] border-2"
                      : "border-gray-300"
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

            <div>
              <span className="text-2xl font-bold text-[#8B3A4A]">
                ₹{currentPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-gray-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-green-600">
              Save ₹{(originalPrice - currentPrice).toFixed(2)}
            </p>

            <p className="text-gray-600 text-sm">{product.description}</p>

            {/* Color */}
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Color: {selectedColor}
              </p>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === c.name
                        ? "border-[#8B3A4A]"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.code }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="font-medium text-gray-700 mb-2">
                Size: {selectedSize}
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s.toString())}
                    className={`px-3 py-1 rounded border ${
                      selectedSize === s.toString()
                        ? "bg-[#8B3A4A] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  dispatch(addToCart(product));
                  showNotification("Added to cart");
                }}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Add To Cart
              </button>
              <button className="flex-1 border py-3 rounded-lg hover:bg-gray-50 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                to={`/products/${rel.id}`}
                key={rel.id}
                className="bg-white rounded-xl p-4 border hover:shadow-lg transition"
              >
                <img
                  src={rel.images[0]}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="text-sm font-medium text-gray-800">
                  {rel.name}
                </h3>
                <p className="text-[#8B3A4A] font-semibold">₹{rel.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
