import React, { useState, useEffect } from "react";
import axios from "axios";
import { ProductCard } from "./ProductCard";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "1"; // Replace with actual user ID from your auth system

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}/wishlist`
      );
      setWishlistItems(response.data.wishlist);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#EBBE43] mb-8">
            My Wishlist
          </h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EBBE43]"></div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Wishlist;
