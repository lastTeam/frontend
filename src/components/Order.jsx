import React, { useState } from 'react';

const OrderComponent = ({ orderId }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentInfo({});
  };

  const handleInputChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async () => {
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvc) {
      alert("Please fill in all credit card details.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedPaymentMethod,
          paymentDetails: paymentInfo,
        }),
      });

      const result = await response.json();
      setConfirmationMessage(
        result.message === "Payment processed successfully"
          ? "Payment was successful! Thank you for your order."
          : "Payment failed. Please try again."
      );
    } catch (error) {
      console.error("Payment submission error:", error);
      setConfirmationMessage("An error occurred while processing the payment.");
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Select Payment Method</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`p-4 rounded-lg border ${
            selectedPaymentMethod === 'credit_card' ? 'border-blue-500' : 'border-gray-300'
          }`}
          onClick={() => handlePaymentSelect('credit_card')}
        >
          <img src="/credit-card-icon.png" alt="Credit Card" className="h-8 w-8" />
        </button>
      </div>

      {selectedPaymentMethod === 'credit_card' && (
        <form className="space-y-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handlePaymentSubmit}
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Payment
          </button>
        </form>
      )}

      {confirmationMessage && (
        <p className="mt-4 text-lg font-medium text-green-600">{confirmationMessage}</p>
      )}
    </div>
  );
};

export default OrderComponent;
