import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details by ID, including reviews and seller information
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  // Destructuring the product information
  const { title, description, basePrice, discountPrice, colors, seller, reviews } = product;

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>Price: ${discountPrice || basePrice}</p>

      {/* Display color options */}
      <div>
        <h3>Available Colors:</h3>
        <div>
          {colors.map((color, index) => (
            <button key={index} style={{ backgroundColor: color, padding: '10px', margin: '5px' }}>
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Seller Information */}
      <div>
        <h3>Seller Information</h3>
        <p>Name: {seller.firstName} {seller.lastName}</p>
        <p>Username: {seller.username}</p>
        <p>Email: {seller.email}</p>
      </div>

      {/* Product Actions */}
      <button onClick={() => console.log('Add to Cart clicked')}>Add to Cart</button>
      <button onClick={() => console.log('Buy Now clicked')}>Buy Now</button>

      {/* Reviews Section */}
      <div>
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
              <p>{review.rating} Stars</p>
              <p>Comment by {review.user.username}: {review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
