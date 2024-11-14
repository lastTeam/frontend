import { Link } from "react-router-dom";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
import { HeroSection } from "./HeroSection";
import { ProductCard } from "./ProductCard";
import { Newsletter } from "./Newsletter";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight,Sparkles } from "lucide-react";

const categories = [
  {
    title: "Tunisian Arts",
    image:
      "https://i.pinimg.com/474x/86/05/10/860510f49cc864bd83145871973d336b.jpg",
  },
  {
    title: "Tradition Selver",
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function getProducts() {
      const data = await axios.get(`${baseUrl}products`);
      setProducts(data.data.products);
      setSortedProducts(data.data.products);
    }
    getProducts();
  }, []);

  const handleSortByPrice = (isDescending) => {
    const clonedProducts = [...products]; // Avoid reference sharing
    const sorted = isDescending
      ? clonedProducts.sort((a, b) => b.basePrice - a.basePrice)
      : clonedProducts.sort((a, b) => a.basePrice - b.basePrice);

    setSortedProducts(sorted);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === categories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? categories.length - 1 : prevIndex - 1
    );
  };

  return (
    <main>
      <Header onSortByPrice={handleSortByPrice} />
      <HeroSection />

      {/* Categories Slider Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#EBBE43]">
            Our Categories
          </h2>

          <div className="relative">
            <div className="flex justify-center items-center gap-8">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none"
              >
                <ChevronLeft className="h-6 w-6 text-[#EBBE43]" />
              </button>

              {/* Categories Display */}
              <div className="flex justify-center items-center gap-8 overflow-hidden h-[400px]">
                {categories.map((category, index) => {
                  const isActive = index === currentIndex;
                  const isPrev =
                    index ===
                    (currentIndex - 1 + categories.length) % categories.length;
                  const isNext =
                    index === (currentIndex + 1) % categories.length;

                  let visibility = "hidden";
                  if (isActive || isPrev || isNext) {
                    visibility = "block";
                  }

                  return (
                    <div
                      key={category.title}
                      className={`transition-all duration-500 transform ${visibility}
                        ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "scale-90 opacity-60"
                        }
                        ${isPrev ? "-translate-x-full" : ""}
                        ${isNext ? "translate-x-full" : ""}`}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-[#EBBE43] shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black bg-opacity-50 px-6 py-3 rounded-full transform transition-transform duration-300 group-hover:scale-110">
                            <h3 className="text-white text-xl font-semibold">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={nextSlide}
                className="absolute right-4 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none"
              >
                <ChevronRight className="h-6 w-6 text-[#EBBE43]" />
              </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 gap-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 
                    ${
                      index === currentIndex
                        ? "bg-[#EBBE43] w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="max-w-6xl mx-auto px-4 py-16">
  <div className="relative">
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
      <Sparkles className="h-12 w-12 text-[#EBBE43] animate-pulse" />
    </div>
    
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-[#EBBE43] text-center mb-6">
          Our Commitment to Excellence
        </h2>
        
        <p className="text-lg font-light text-gray-700 tracking-wide leading-relaxed">
          <span className="font-medium text-[#EBBE43]">Crafty</span> guaranteeing ceramic of super quality. Our passion would be nothing without it being shared with you.
        </p>
        
        <p className="text-lg font-light text-gray-700 tracking-wide leading-relaxed">
          Hence, we are engaged to building your loyalty and satisfying you by offering you <span className="font-medium">100% authentic, handmade</span> and <span className="font-medium">high-quality pottery</span>.
        </p>
        
        <p className="text-lg font-light text-gray-700 tracking-wide leading-relaxed">
          Our excellence goes through our requirement in terms of products. For this, we surround ourselves with best designers and potters to offer you the most quantitative pottery that it is possible to find.
        </p>
        
        <div className="flex justify-center pt-6">
          <Link to="/products" className="inline-flex items-center px-6 py-3 bg-[#EBBE43] text-white rounded-full hover:bg-[#d4a93c] transition-colors duration-300 transform hover:scale-105">
            Discover Our Collection
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* New Arrivals Section */}
      <section className="flex flex-col items-center pt-12 pl-20 w-full bg-white max-md:pl-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-0 justify-center w-full font-medium tracking-tight max-w-[1120px] max-md:max-w-full mx-auto">
  <h2 className="text-4xl leading-10 text-[#EBBE43]">
    New Arrivals
  </h2>
</div>

        <div className="flex flex-wrap gap-6 self-end mt-12 max-md:mt-10">
          {sortedProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex flex-col items-start mt-12 max-w-full bg-gray-200 rounded-[80px] w-[1120px] max-md:pr-5 max-md:mt-10">
          <div className="flex shrink-0 max-w-full h-1 bg-neutral-700 rounded-[80px] w-[834px]" />
        </div>
      </section>

      {/* Features Section */}
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
                <div className="flex flex-col grow justify-center items-start px-8 py-12 w-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 max-md:px-5 max-md:mt-6">
                  <img
                    loading="lazy"
                    src={feature.icon}
                    alt=""
                    className="object-contain w-12 aspect-square"
                  />
                  <h3 className="mt-4 text-xl font-medium leading-snug text-[#EBBE43]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#EBBE43]">
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
