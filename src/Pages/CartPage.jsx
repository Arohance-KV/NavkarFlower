// src/Pages/CartPage.jsx
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import Toast from "../Components/Toast";

// ==========================
// RTK Query – USER CART
// ==========================
import {
  useGetCartDetailsQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../Services/cartApi";

// ==========================
// RTK Query – GUEST CART
// ==========================
import {
  useGetGuestCartDetailsQuery,
  useUpdateGuestCartItemMutation,
  useRemoveGuestCartItemMutation,
} from "../Services/guestCartApi";

import { getGuestSessionId } from "../utils/session";

const CartPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const sessionId = getGuestSessionId();

  const [notification, setNotification] = useState(null);

  // ==========================
  // USER CART
  // ==========================
  const {
    data: userCart,
    isLoading: userLoading,
  } = useGetCartDetailsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [updateUserItem] = useUpdateCartItemMutation();
  const [removeUserItem] = useRemoveCartItemMutation();

  // ==========================
  // GUEST CART
  // ==========================
  const {
    data: guestCart,
    isLoading: guestLoading,
  } = useGetGuestCartDetailsQuery(sessionId, {
    skip: isAuthenticated,
  });

  const [updateGuestItem] = useUpdateGuestCartItemMutation();
  const [removeGuestItem] = useRemoveGuestCartItemMutation();

  // ==========================
  // DERIVED DATA
  // ==========================
  const items = isAuthenticated
    ? userCart?.items || []
    : guestCart?.items || [];

  const totals = isAuthenticated
    ? userCart?.totals || {}
    : guestCart?.totals || {};

  // ==========================
  // HANDLERS
  // ==========================
  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;

    if (isAuthenticated) {
      updateUserItem({
        itemId,
        updates: { quantity },
      });
    } else {
      updateGuestItem({
        sessionId,
        itemId,
        payload: { quantity },
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    if (isAuthenticated) {
      removeUserItem(itemId);
    } else {
      removeGuestItem({ sessionId, itemId });
    }

    setNotification({ message: "Item removed", type: "info" });
    setTimeout(() => setNotification(null), 3000);
  };

  // ==========================
  // LOADING STATES
  // ==========================
  if (userLoading || guestLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2>Your cart is empty</h2>
        <Link to="/product">Continue Shopping</Link>
      </div>
    );
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl mb-6">
          Your Cart ({totals.itemCount || items.length})
        </h1>

        {items.map((item) => {
          const product = item.product || item;
          const itemId = item._id;
          const quantity = item.quantity;

          return (
            <div key={itemId} className="bg-white p-6 rounded-lg mb-4">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() =>
                    handleQuantityChange(itemId, quantity - 1)
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(itemId, quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveItem(itemId)}
                className="text-red-500 mt-2"
              >
                Remove
              </button>
            </div>
          );
        })}
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

export default CartPage;
