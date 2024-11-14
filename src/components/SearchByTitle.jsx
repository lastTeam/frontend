import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "./home/ProductCard";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import Header from './layout/Header'

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const { title } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getProd/${title}`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [title]);

  return (
    // <div
    //   className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 
    //   relative overflow-hidden"
    // >
    <div>
      <Header/>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 bg-[size:100px_100px] 
        bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),
        linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
      ></div>

      {/* Search Results Container */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Search Title Section */}
        <div
          className="mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl 
          shadow-lg text-center flex items-center justify-center gap-4"
        >
          <Search className="w-10 h-10 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for "{title}"
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-16 w-16 
              border-t-4 border-yellow-600"
            ></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length === 0 ? (
          <div
            className="text-center bg-white/80 backdrop-blur-sm 
            rounded-xl p-12 shadow-lg"
          >
            <p className="text-2xl text-gray-600">
              No products found for "{title}"
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
            lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="transform transition-all duration-300 
                hover:scale-105 hover:shadow-2xl"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
     </div>
  );
};

export default SearchResults;
