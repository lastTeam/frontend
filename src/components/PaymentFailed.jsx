import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-center p-4">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-8">
        We're sorry, but there was an issue with your payment. Please try again or contact support if the problem persists.
      </p>

      <div className="flex gap-4">
        <Link
          to="/checkout"
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Try Again
        </Link>
        
        <Link
          to="/home"
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
