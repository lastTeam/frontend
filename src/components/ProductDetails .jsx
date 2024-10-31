import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./home/CartContext";

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
      setError("Please log in to add items to cart");
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
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center text-red-500">Product not found.</div>;
  }

  const {
    title,
    description,
    basePrice,
    discountPrice,
    colors,
    reviews,
    images,
    owner,
  } = product;

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="flex flex-col gap-4">
          {[...new Set(images)]?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={title}
              className="object-cover rounded-lg w-full h-96 shadow-md"
            />
          ))}
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-700">{description}</p>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            {discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-red-600 line-through">
                  ${basePrice}
                </span>
                <span className="text-3xl font-semibold text-gray-900">
                  ${discountPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-semibold text-gray-900">
                ${basePrice}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Available Colors:</span>
            <div className="flex gap-2">
              {colors?.map((color, index) => (
                <span
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="flex flex-col gap-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex gap-4">
              <button
                className={`flex-1 px-4 py-3 font-medium rounded-lg shadow-md transition duration-300 ${
                  isInCart
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
                onClick={handleAddToCart}
              >
                {isInCart
                  ? "Add Another & View Cart"
                  : "Add to Cart & View Cart"}
              </button>
              <button
                className="flex-1 px-4 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {addedToCart && (
              <div className="text-green-500 text-center font-medium animate-fade-in-out">
                ✓ Added to cart successfully! Redirecting to cart...
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews
            </h2>
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-600">({review.rating}/5)</span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      - {review.user?.username}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Seller Information */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Seller Information
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {owner?.firstName}{" "}
                {owner?.lastName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Username:</span> {owner?.username}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {owner?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
