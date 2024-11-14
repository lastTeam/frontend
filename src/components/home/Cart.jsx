import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Package, CreditCard, ArrowLeft } from "lucide-react";
import { Header } from "../layout/Header";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, cartItems, setCartItems } = useCart();
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
        setCartItems(Array.isArray(data) ? itemsWithQuantity : []); // Update context cart items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, setCartItems]);

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
  const handleCheckout = () => {
    const checkoutData = {
      cartItems,
      totalAmount: calculateTotal(),
      userId
    };
    
    // Navigate to checkout with cart data
    navigate('/checkout', { 
      state: { 
        checkoutData: {
          cartItems,
          totalAmount: calculateTotal()
        }
      }
    });
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#EBBE43]"></div>
          <p className="text-gray-600 animate-pulse">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg p-6 max-w-lg w-full">
          <h3 className="text-red-500 font-semibold text-lg mb-2">Oops!</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 inline-flex items-center text-red-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-[#EBBE43] hover:text-[#d4a93c] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Your cart is empty</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="mt-6 inline-flex items-center px-6 py-3 bg-[#EBBE43] text-white rounded-full hover:bg-[#d4a93c] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
                  >
                    <div className="flex items-center gap-6">
                      {item.product.images && item.product.images[0] && (
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-xl overflow-hidden">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.product.title}
                        </h3>
                        <p className="text-[#EBBE43] font-medium mb-4">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, -1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartItems.length})</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#EBBE43]">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#EBBE43] text-white px-6 py-4 rounded-full hover:bg-[#d4a93c] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    Checkout Now
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Package className="h-5 w-5" />
                    <span className="text-sm">Free shipping on all orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;