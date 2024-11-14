import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-center p-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8">
        Thank you for your purchase! Your order has been successfully placed.
      </p>

      <div className="flex gap-4">
        
        
        <Link
          to="/"
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
