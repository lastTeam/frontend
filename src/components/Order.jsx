import React, { useState, useEffect } from "react";
import { useCart } from "../components/home/CartContext";
import { useNavigate } from "react-router-dom";

const Order = ({ amount, productId }) => {
  const { userId } = useCart();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: "", expiryDate: "", cvc: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("amount:", amount);
  }, [userId, productId, amount]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !productId || !amount || !selectedPaymentMethod) {
      alert("Missing payment or user information.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentInfo.cardNumber,
          amount: parseFloat(amount),
          userId: userId,
          productId: productId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setConfirmationMessage(result.message || "Payment successful!");
      navigate("/confirmation");
    } catch (error) {
      console.error("Payment submission error:", error);
      setConfirmationMessage("An error occurred while processing the payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Payment</h2>
      
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-gray-600 font-medium">Card Number</label>
          <input
            type="text"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-gray-600 font-medium">Expiry Date</label>
          <input
            type="text"
            value={paymentInfo.expiryDate}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MM/YY"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-gray-600 font-medium">CVC</label>
          <input
            type="text"
            value={paymentInfo.cvc}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Submit Payment"}
        </button>
      </form>

      {confirmationMessage && (
        <div className="mt-6 text-center text-gray-700 font-medium">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default Order;
