import React, { useState, useEffect } from "react";
import { useCart } from "../components/home/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QHjJ1GCPoGVlr6tHjhMVyVgUGpv6eVUDU3Awg0k4P6giNkIVMYpTyTNUgUNnFcRq5ij6Tg4Qyy7G1Ja7JbqCeVd004XHm15aq');

// Payment form component
function CheckoutForm({ checkoutData, userId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError("");

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Create order after successful payment
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items: checkoutData.cartItems,
          totalAmount: checkoutData.totalAmount,
          paymentIntentId: paymentError.payment_intent.id
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      onSuccess(orderData);

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isProcessing || !stripe}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Complete Payment'
        )}
      </button>
    </form>
  );
}

// Main Order component
const Order = () => {
  const { userId } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutData } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!checkoutData || !userId) {
      navigate('/cart');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch('http://localhost:5000/api/orders/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: checkoutData.totalAmount,
        items: checkoutData.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        }))
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error:', error));
  }, [checkoutData, userId, navigate]);

  const handlePaymentSuccess = (orderData) => {
    navigate('/confirmation', { state: { orderData } });
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Complete Your Order</h2>
        
        {checkoutData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600">
              <p>Total Items: {checkoutData.cartItems.length}</p>
              <p className="font-medium mt-1">Total: ${checkoutData.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              checkoutData={checkoutData}
              userId={userId}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Order;