// src/components/OrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams(); // Capture orderId from the URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ${order.price.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <h3 className="font-medium mt-4">Items:</h3>
        <ul className="list-disc pl-5">
          {order.items.map((item) => (
            <li key={item.productId}>
              {item.productName} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
