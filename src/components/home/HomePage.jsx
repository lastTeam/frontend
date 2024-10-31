import { Link } from "react-router-dom";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { HeroSection } from "./HeroSection";
import { CategoryCard } from "./CategoryCard";
import { ProductCard } from "./ProductCard";
import { Newsletter } from "./Newsletter";
import { useState, useEffect } from "react";
import axios from "axios";


const categories = [
  {
    title: "Tunisian Arts",
    image:
      "https://i.pinimg.com/474x/86/05/10/860510f49cc864bd83145871973d336b.jpg",
    className: "min-h-[664px]",
  },
  {
    title: "Tradition Selver ",
    image:
      "https://i.pinimg.com/736x/3c/65/74/3c657465f9664a9037b8ce2a3bc90904.jpg",
  },
  {
    title: "Khazaf",
    image:
      "https://i.pinimg.com/474x/5b/f9/ec/5bf9ecee4f0f6d9c2995627439bdbc23.jpg",
  },
];
const baseUrl = "http://localhost:5000/api/";
export function HomePage() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isSorted, setIsSorted] = useState(false);


  useEffect(() => {
    async function getProducts() {
      const data = await axios.get(`${baseUrl}products`);
      setProducts(data.data.products);
      setSortedProducts(data.data.products);
    }
    getProducts();
  }, []);

 



  console.log("products", products);
  const handleSortByPrice = (isDescending) => {
    // Toggle sorting only when the filter button is clicked
    const sorted = isDescending
      ? [...products].sort((a, b) => b.basePrice - a.basePrice)
      : [...products].sort((a, b) => a.basePrice - b.basePrice);

    setSortedProducts(sorted);
    setIsSorted(true); // Mark sorting as applied
  };

  return (
    <main>
      <Header onSortByPrice={handleSortByPrice} />
      <HeroSection />
    
      <section className="flex flex-col items-center px-16 w-full bg-white max-md:px-5 max-md:max-w-full">
        <div className="w-full max-w-[1120px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className={`flex flex-col ${
                  index === 0 ? "w-6/12" : "ml-5 w-6/12"
                } max-md:ml-0 max-md:w-full`}
              >
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center pt-12 pl-20 w-full bg-white max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between w-full font-medium tracking-tight max-w-[1120px] max-md:max-w-full">
          <h2
            className="text-4xl leading-10 text-black"
            style={{ color: "#EBBE43" }}
          >
            New
            <br />
            Arrivals
          </h2>
          <Link
            to="/products"
            className="flex overflow-hidden relative flex-col self-end mt-16 text-base leading-7 border-b border-solid aspect-[4.714] border-b-neutral-900 text-neutral-900 w-[132px] max-md:mt-10"
          >
            More Products
          </Link>
        </div>
        <div className="flex flex-wrap gap-6 self-end mt-12 max-md:mt-10">
          {sortedProducts?.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
        <div className="flex flex-col items-start mt-12 max-w-full bg-gray-200 rounded-[80px] w-[1120px] max-md:pr-5 max-md:mt-10">
          <div className="flex shrink-0 max-w-full h-1 bg-neutral-700 rounded-[80px] w-[834px]" />
        </div>
      </section>

      <section className="flex flex-col justify-center items-center px-16 py-12 w-full bg-white max-md:px-5 max-md:max-w-full">
        <div className="w-full max-w-[1120px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            {[
              {
                icon: "https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/3e5ec843eb5472fbb48e1b4545ff01a07418018188f4bdb255ec6ddb8815ac31?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&",
                title: "Free Shipping",
                description: "Order above $200",
              },
              {
                icon: "https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/b8a0fd8160e58ee0fe918fb2b97a5e7b72f25fce92c4b590f46dcc4fd03ef3a4?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&",
                title: "Money-back",
                description: "30 days guarantee",
              },
              {
                icon: "https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/994ca45c330b7b6a47d574edeaf040cbb965d0bf92d6b762340d15954b0de408?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&",
                title: "Secure Payments",
                description: "Secured by Stripe",
              },
              {
                icon: "https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/994ca45c330b7b6a47d574edeaf040cbb965d0bf92d6b762340d15954b0de408?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&",
                title: "24/7 Support",
                description: "Phone and Email support",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full"
              >
                <div className="flex flex-col grow justify-center items-start px-8 py-12 w-full bg-gray-100 max-md:px-5 max-md:mt-6">
                  <img
                    loading="lazy"
                    src={feature.icon}
                    alt=""
                    className="object-contain w-12 aspect-square"
                  />
                  <h3
                    className="mt-4 text-xl font-medium leading-snug"
                    style={{ color: "#EBBE43" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6 text-zinc-500"
                    style={{ color: "#EBBE43" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}

export default HomePage;
