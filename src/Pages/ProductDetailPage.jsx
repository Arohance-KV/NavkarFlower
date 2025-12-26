// src/Pages/ProductDetailPage.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Toast from "../Components/Toast";
import { Heart, Share2, Check } from "lucide-react";
import { FiLoader } from "react-icons/fi";


// RTK Query – Products
import {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
} from "../Services/productApi";


// RTK Query – Categories & Subcategories
import { useGetCategoryByIdQuery } from "../Services/categoryApi";
import { useGetSubCategoryByIdQuery } from "../Services/subCategoryApi";


// RTK Query – Cart
import { useAddToCartMutation } from "../Services/cartApi";
import { useAddGuestCartItemMutation } from "../Services/guestCartApi";

// RTK Query – Wishlist
import {
  useToggleWishlistMutation,
  useGetWishlistQuery,
} from "../Services/wishlistApi";

// Utils
import { getGuestSessionId } from "../utils/session";

const ProductDetailsPage = () => {
  const { id } = useParams();

 
  // AUTH
  const { isAuthenticated } = useSelector((state) => state.auth);

  // RTK QUERY – PRODUCT
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id);

  
  // RTK QUERY – CATEGORY & SUBCATEGORY
  const { data: category } = useGetCategoryByIdQuery(product?.category, {
    skip: !product?.category,
  });

  const { data: subcategory } = useGetSubCategoryByIdQuery(product?.subcategory, {
    skip: !product?.subcategory,
  });

  // Related products
  const { data: allProductsData } = useGetAllProductsQuery(undefined, {
    skip: !id,
  });


  // RTK QUERY – CART
  const [addToCart] = useAddToCartMutation();
  const [addGuestCartItem] = useAddGuestCartItemMutation();
  const sessionId = getGuestSessionId();

  // RTK QUERY – WISHLIST
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleWishlist] = useToggleWishlistMutation();


  // LOCAL UI STATE
  const [mainImage, setMainImage] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // DERIVED DATA
  const colors = product?.colors || [];
  const selectedColor = colors[selectedColorIndex];
  const availableSizes = useMemo(
    () => selectedColor?.sizeStock || [],
    [selectedColor]
  );
  const colorImages = useMemo(
    () => selectedColor?.images || [],
    [selectedColor]
  );


  // SIDE EFFECTS
  useEffect(() => {
    if (colorImages.length > 0) {
      setMainImage(colorImages[0]);
    }
  }, [selectedColorIndex, colorImages]);

  useEffect(() => {
    // Auto-select first available size when color changes
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0].size);
    }
  }, [selectedColorIndex, availableSizes]);

  useEffect(() => {
    // Check if product is in wishlist
    if (wishlistData?.items && product?._id) {
      const isInWishlist = wishlistData.items.some(
        (item) => item.product?._id === product._id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistData, product]);

  // HELPERS
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleColorChange = (index) => {
    setSelectedColorIndex(index);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showNotification("Please login to add to wishlist", "error");
      return;
    }

    try {
      await toggleWishlist({
        productId: product._id,
        priceWhenAdded: product.price,
      }).unwrap();

      setIsWishlisted(!isWishlisted);
      showNotification(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (error) {
      showNotification("Failed to update wishlist", "error");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on our website!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // Use native share if available
        await navigator.share(shareData);
        showNotification("Shared successfully!");
      } else {
        // Fallback to copy link
        await navigator.clipboard.writeText(window.location.href);
        showNotification("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled share or error occurred
      if (error.name !== "AbortError") {
        showNotification("Failed to share", "error");
      }
    }
  };


  // LOADING & ERROR
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-[#c9a47c]" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-rose-50">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-red-700 max-w-md shadow-lg">
          <p className="font-bold text-lg mb-2">Error Loading Product</p>
          <p className="mb-6">Product not found</p>
          <Link
            to="/product"
            className="text-red-600 hover:text-red-800 font-semibold inline-block transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // ==========================
  // DERIVED DATA
  // ==========================
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Normalize related products data
  const getProductArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.products || data.data || [];
  };

  const relatedProducts = getProductArray(allProductsData)
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  // ==========================
  // ADD TO CART
  // ==========================
  const handleAddToCart = async () => {
    if (!selectedSize) {
      showNotification("Please select a size", "error");
      return;
    }

    try {
      if (isAuthenticated) {
        await addToCart({
          productId: product._id,
          quantity: 1,
          size: selectedSize,
          color: {
            colorName: selectedColor?.colorName || "Default",
            colorHex: selectedColor?.colorHex || "#000000",
          },
          selectedImage: mainImage,
        }).unwrap();
      } else {
        await addGuestCartItem({
          sessionId,
          product: product._id,
          quantity: 1,
          size: selectedSize,
          color: {
            colorName: selectedColor?.colorName || "Default",
            colorHex: selectedColor?.colorHex || "#000000",
          },
          selectedImage: mainImage,
        }).unwrap();
      }

      showNotification("Added to cart successfully!");
    } catch {
      showNotification("Failed to add to cart", "error");
    }
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-rose-50">
      {/* Header Navigation */}
      <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 py-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#8B3A4A] transition font-medium">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/product" className="hover:text-[#8B3A4A] transition font-medium">
              Products
            </Link>
            {category?.name && (
              <>
                <span className="text-gray-300">/</span>
                <span className="hover:text-[#8B3A4A] font-medium">{category.name}</span>
              </>
            )}
            {subcategory?.name && (
              <>
                <span className="text-gray-300">/</span>
                <span className="hover:text-[#8B3A4A] font-medium">{subcategory.name}</span>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-[#8B3A4A] font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image Container */}
            {mainImage && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-100 to-gray-50 aspect-square shadow-2xl">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {discount > 0 && (
                    <div className="absolute top-6 left-6">
                      <div className="bg-linear-to-r from-red-500 to-rose-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl">
                        {discount}% OFF
                      </div>
                    </div>
                  )}
                </div>
                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-3 z-10">
                  <button
                    onClick={handleWishlistToggle}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      size={20}
                      className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                    title="Share this product"
                  >
                    <Share2 size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {colorImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {colorImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative flex shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                      mainImage === img
                        ? "border-[#8B3A4A] ring-2 ring-[#8B3A4A] ring-offset-2"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4 flex flex-col justify-between font-slab">
            {/* Product Header */}
            <div className="space-y-2">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                  {product.productCode}
                </span>
                {category?.name && (
                  <span className="px-3 py-1 bg-[#8B3A4A]/10 text-[#8B3A4A] rounded-full text-xs font-semibold">
                    {category.name}
                  </span>
                )}
                {subcategory?.name && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                    {subcategory.name}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-3xl font-semibold text-[#8B3A4A]">
                  ₹{currentPrice}/-
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{originalPrice}/-
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            {product.productDetails && (
              <div className="bg-linear-to-r from-rose-50 to-pink-50 p-2 rounded-2xl border border-rose-100">
                <p className="text-gray-700 leading-relaxed">{product.productDetails}</p>
              </div>
            )}

            {/* Material Info */}
            {product.material && (
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <span className="font-semibold text-gray-800">Material:</span>
                <span className="text-gray-600 font-medium">{product.material}</span>
              </div>
            )}

            {/* Features */}
            {product.bulletPoints && product.bulletPoints.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900">Key Features</h3>
                <ul className="space-y-2">
                  {product.bulletPoints.map((bullet, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="flex shrink-0 text-[#8B3A4A] font-bold mt-1">
                        ✓
                      </span>
                      <span className="font-medium">{bullet.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <div>
                  <p className="font-slab text-gray-900 text-lg mb-1">Color</p>
                  <p className="text-[#8B3A4A] font-semibold">
                    {selectedColor?.colorName}
                  </p>
                </div>
                <div className="flex gap-4">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={`relative w-6 h-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ring-offset-2 ${
                        selectedColorIndex === index
                          ? "ring-2 ring-[#8B3A4A] scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.colorHex }}
                      title={color.colorName}
                    >
                      {selectedColorIndex === index && (
                        <Check className="absolute inset-0 m-auto text-white" size={24} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div>
                  <p className="font-slab text-gray-900 text-lg mb-1">Size</p>
                  <p className="text-[#8B3A4A] font-semibold">
                    {selectedSize || "Select a size"}
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {availableSizes.map((sizeObj) => (
                    <button
                      key={sizeObj.size}
                      onClick={() => handleSizeChange(sizeObj.size)}
                      disabled={sizeObj.stock === 0}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        selectedSize === sizeObj.size
                          ? "bg-linear-to-r from-[#C48B9F] to-[#8B3A4A] text-white shadow-lg scale-105"
                          : sizeObj.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border-2 border-gray-200 text-gray-800 hover:border-[#8B3A4A] hover:text-[#8B3A4A] hover:scale-105"
                      }`}
                    >
                      {sizeObj.size}
                      {sizeObj.stock === 0 && (
                        <span className="block text-xs">Out of Stock</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-linear-to-r from-[#C48B9F] to-[#8B3A4A] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
              >
                Add To Cart
              </button>
              <button className="flex-1 border-2 border-[#8B3A4A] text-[#8B3A4A] py-4 rounded-xl font-bold text-lg hover:bg-[#8B3A4A] hover:text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                You May Also Like
              </h2>
              <div className="w-20 h-1 bg-linear-to-r from-[#8B3A4A] to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rel) => {
                const relOriginalPrice = rel.originalPrice;
                const relDiscount = relOriginalPrice
                  ? Math.round(
                    ((relOriginalPrice - rel.price) / relOriginalPrice) * 100
                  )
                  : 0;

                return (
                  <Link
                    key={rel._id}
                    to={`/products/${rel._id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#8B3A4A]/30"
                  >
                    <div className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 aspect-square">
                      <img
                        src={rel.images?.[0] || rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {relDiscount > 0 && (
                        <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {relDiscount}% OFF
                        </div>
                      )}
                      <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Heart size={18} className="text-gray-700" />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#8B3A4A] transition-colors">
                        {rel.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-[#8B3A4A]">
                          ₹{rel.price}
                        </p>
                        {relOriginalPrice && relOriginalPrice > rel.price && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{relOriginalPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
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