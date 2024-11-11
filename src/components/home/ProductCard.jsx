import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-hot-toast';

export function ProductCard({ product,onWishlistUpdate  }) {
  const { id, images, title, basePrice, description, discountPrice } = product;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  // Ensure unique images in case duplicates exist
  const uniqueImages = [...new Set(images)];

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId) return; // Don't check if no user is logged in
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/wishlist`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data && response.data.wishlist) {
          // Ensure we're comparing numbers with numbers
          const productId = typeof id === 'string' ? parseInt(id) : id;
          setIsInWishlist(response.data.wishlist.some(item => 
            (typeof item.id === 'string' ? parseInt(item.id) : item.id) === productId
          ));
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          toast.error('Please login again');
        }
      }
    };
    
    checkWishlistStatus();
  }, [id, userId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await axios.delete(
          `http://localhost:5000/api/users/${userId}/wishlist/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `http://localhost:5000/api/users/${userId}/wishlist/${id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      if (onWishlistUpdate) {
        onWishlistUpdate();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        toast.error('Please login again');
      } else {
        const errorMessage = error.response?.data?.error || 'Error updating wishlist';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex flex-col relative group mx-2">
      <div className="relative flex flex-col p-4 w-full">
        {uniqueImages?.slice(0, 1).map((image, index) => (
          <img
            key={index}
            loading="lazy"
            src={image}
            alt={title}
            className="object-cover rounded-lg w-full h-72"
          />
        ))}
        <div className="flex relative gap-5 justify-between w-full mt-4">
          <button
            onClick={toggleWishlist}
            disabled={isLoading}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex gap-2.5 justify-center items-center self-start p-2 w-8 h-8 bg-white shadow-lg rounded-full transition-all duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/3714cfabe2983e4c602cbe5f040355d9cd771c21051eaee0ba27d2338fee59eb?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&"
              alt={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              className={`object-contain w-5 h-5 ${isInWishlist ? 'filter brightness-0' : ''}`}
              style={{
                filter: isInWishlist 
                  ? "invert(21%) sepia(100%) saturate(3282%) hue-rotate(351deg) brightness(97%) contrast(105%)"
                  : "none"
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-3 min-h-[72px]">
        <h3 className="self-stretch mt-1 text-base font-semibold leading-tight text-neutral-900">
          {title}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-sm leading-tight">
          {discountPrice ? (
            <>
              <span className="font-semibold text-red-600 line-through">
                D{basePrice}
              </span>
              <span className="font-semibold text-neutral-900">
                D{discountPrice}
              </span>
            </>
          ) : (
            <span className="font-semibold text-neutral-900">D{basePrice}</span>
          )}
        </div>

        <div className="mt-1 text-sm leading-tight text-neutral-700 line-clamp-2">
          {description}
        </div>
      </div>

      <Link to={`/products/${id}`} className="mt-4 mb-2">
        <button className="w-full px-6 py-2.5 text-base font-medium tracking-tight leading-7 text-white rounded-lg shadow-lg bg-[#EBBE43] hover:bg-[#D4A833] transition-colors duration-300">
          Product Details
        </button>
      </Link>
    </article>
  );
}

export default ProductCard;