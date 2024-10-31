import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Fetch the product data by ID
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center text-red-500">Product not found.</p>;

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

          <div className="flex items-center gap-4">
            {discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-red-600 line-through">
                  D{basePrice}
                </span>
                <span className="text-3xl font-semibold text-gray-900">
                  D{discountPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-semibold text-gray-900">
                D{basePrice}
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
                  className={`w-6 h-6 rounded-full border border-gray-300`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="mt-2 p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="text-gray-700">Rating: {review.rating}/5</p>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-gray-500">
                    - {review.user?.username}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* Seller Information */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
            <p className="text-gray-700">
              <strong>Name:</strong> {owner?.firstName} {owner?.lastName}
            </p>
            <p className="text-gray-700">
              <strong>Username:</strong> {owner?.username}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {owner?.email}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
              Add to Cart
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
