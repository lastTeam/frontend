import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProductCard } from './home/ProductCard'; 
import { useParams } from 'react-router-dom';
const SearchResults = () => {
  const [products, setProducts] = useState([]);
 const {title} = useParams()
const [loading , setLoading]=useState(true)


console.log(title);


  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getProd/${title}`);
        setProducts(response.data); 
       setLoading(false)
      } catch (error) {
        console.log('you');

        console.error('Error fetching search results:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
     
      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} /> 
        ))}
      </div>
       
         
        
    </div>
  );
};

export default SearchResults;
