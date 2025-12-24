import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../Redux/cartSlice";
import { Link } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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
        backgroundImage: "url('/assets/cart-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 bg-white/90 backdrop-blur inline-block px-6 py-2 rounded-lg">
          Your Cart
        </h1>

        <div className="space-y-6">
          {items.map((item) => {
            const product = item.product;
            const subtotal = product.price * item.quantity;

            return (
              <div
                key={product.id}
                className="bg-white/90 backdrop-blur rounded-xl shadow-md p-6 flex items-center space-x-6"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-[#8B3A4A] font-semibold">
                    ₹{product.price}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, item.quantity - 1)
                    }
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, item.quantity + 1)
                    }
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-[#8B3A4A]">
                    ₹{subtotal}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(product.id))}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white/90 backdrop-blur rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-[#8B3A4A]">
              ₹{total}
            </span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center py-3 bg-[#8B3A4A] text-white rounded-lg hover:bg-[#6D2C3A] transition font-semibold"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
