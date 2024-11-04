import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your cart");
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const itemsWithQuantity = data.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCartItems(Array.isArray(data) ? itemsWithQuantity : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = (productId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, (item.quantity || 1) + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6 text-lg">Your cart is empty.</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-6 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center space-x-6">
                {item.product.images && item.product.images[0] && (
                  <div className="relative group">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {item.product.title}
                  </h3>
                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-medium">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, -1)}
                    className="p-2 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center px-2 py-2 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, 1)}
                    className="p-2 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.product.id)}
                  className="group p-2 rounded-full hover:bg-red-100 transition-colors duration-300"
                >
                  <Trash2 className="h-5 w-5 text-red-500 group-hover:text-red-700 transition-colors duration-300" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">
                Total Items: {cartItems.length}
              </span>
              <div className="text-2xl font-bold text-gray-800">
                ${calculateTotal().toFixed(2)}
              </div>
            </div>
            <button className="w-full bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
