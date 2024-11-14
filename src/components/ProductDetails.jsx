import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./home/CartContext";
import { Header } from "../components/layout/Header.jsx";
import Swal from "sweetalert2";


function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart, cartItems, userId } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = async () => {
    if (!userId) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to add items to your cart.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EBBE43",
        background: "#fef9e7",
        customClass: {
          popup: "animated fadeIn",
        },
      });
      return;
    }
    

    if (product) {
      try {
        const response = await fetch("http://localhost:5000/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            userId: userId,
            quantity: 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }

        addToCart(product);
        setAddedToCart(true);
        setError(null);

        // Navigate to cart page after successful addition
        navigate("/cart");
      } catch (error) {
        console.error("Error adding item to cart:", error);
        setError("Failed to add item to cart. Please try again.");
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      // Additional buy now logic could go here
      navigate("/cart"); // Or navigate to a checkout page directly
    } catch (error) {
      console.error("Error processing buy now:", error);
      setError("Failed to process purchase. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-red-500">Product not found.</div>;
  }

  const {
    title,
    description,
    basePrice,
    discountPrice,
    colors,
    images,
    owner,
  } = product;

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Container - Full Width */}
      <div className="w-full">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Images Section */}
            <div className="space-y-4">
              {[...new Set(images)]?.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={image}
                    alt={`${title} - View ${index + 1}`}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4">
                {discountPrice ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-400 line-through">${basePrice}</span>
                    <span className="text-3xl font-bold text-red-600">${discountPrice}</span>
                    <span className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded-md">
                      {Math.round(((basePrice - discountPrice) / basePrice) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${basePrice}</span>
                )}
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <span className="text-lg font-medium text-gray-700">Available Colors:</span>
                <div className="flex gap-3">
                  {colors?.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    className={`flex-1 px-6 py-3 text-lg font-medium rounded-lg shadow-md transition-all duration-300 
                      ${isInCart 
                        ? "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700" 
                        : "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"
                      } text-white transform hover:-translate-y-1`}
                    onClick={handleAddToCart}
                  >
                    {isInCart ? "Add Another & View Cart" : "Add to Cart & View Cart"}
                  </button>
                  <button
                    className="flex-1 px-6 py-3 text-lg font-medium bg-blue-500 text-white rounded-lg shadow-md 
                      hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>

                {addedToCart && (
                  <div className="p-3 text-green-600 bg-green-50 rounded-lg text-center font-medium animate-pulse">
                    ✓ Added to cart successfully! Redirecting to cart...
                  </div>
                )}
              </div>

              {/* Seller Information */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Seller Information
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{owner?.firstName} {owner?.lastName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Username:</span>
                    <span>{owner?.username}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{owner?.email}</span>
                  </p>
                </div>
              </div>

              {/* Contact Button */}
              <button
                className="w-full px-6 py-4 text-lg font-medium bg-yellow-500 text-white rounded-lg shadow-md 
                  hover:bg-yellow-600 active:bg-yellow-700 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => navigate("/chat")}
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;