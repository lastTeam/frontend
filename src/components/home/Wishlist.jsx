import React, { useState, useEffect } from "react";
import axios from "axios";
import { ProductCard } from "./ProductCard";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { toast } from 'react-hot-toast';

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      toast.error('Please login to view your wishlist');
      return;
    }
    fetchWishlist();
  }, [userId, token]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}/wishlist`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.wishlist) {
        // Ensure all necessary product data is present
        const completeWishlistItems = response.data.wishlist.map(item => ({
          ...item,
          id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
          images: item.images || [],
          title: item.title || 'Untitled Product',
          basePrice: item.basePrice || 0,
          description: item.description || '',
          discountPrice: item.discountPrice || null
        }));
        setWishlistItems(completeWishlistItems);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        toast.error('Please login again');
      } else {
        toast.error('Error loading wishlist');
      }
      setLoading(false);
    }
  };

  // Add a refresh handler that can be passed to ProductCard
  const handleWishlistUpdate = () => {
    fetchWishlist();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#EBBE43] mb-8">
            My Wishlist
          </h1>

          {!userId || !token ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Please login to view your wishlist</p>
            </div>
          ) : loading ? (
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
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onWishlistUpdate={handleWishlistUpdate} 
                />
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