import React, { useEffect, useState } from "react";

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined, cannot fetch cart items.");
      return; // Exit if userId is not available
    }

    const fetchCartItems = async () => {
      try {
        console.log("Fetching cart for User ID:", userId);
        const response = await fetch(
          `http://localhost:5000/api/cart/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await response.json();
        setCartItems(data); // Assuming your API returns an array of cart items
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, [userId]);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.product.title} - ${item.price} (Quantity: {item.quantity})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
