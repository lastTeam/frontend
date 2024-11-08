import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";

export function Header({ onSortByPrice }) {
  const [isDescending, setIsDescending] = React.useState(true);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSortClick = () => {
    setIsDescending(!isDescending);
    onSortByPrice(isDescending);
  };

  const handleSearchResults = (e) => {
    setSearch(e.target.value);
  };

  const handlesearch = async () => {
    if (search) {
      navigate(`/search/${search}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlesearch();
    }
  };

  return (
    <header>
      <div
        className="flex flex-wrap gap-10 justify-end py-2 pr-4 pl-20 w-full text-sm max-md:pl-5 max-md:max-w-full"
        style={{ backgroundColor: "#EBBE43" }}
      ></div>
      <nav
        className="flex items-center justify-between px-20 py-4 w-full max-md:px-5 max-md:max-w-full"
        style={{ backgroundColor: "#EBBE43" }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-4xl font-medium italic tracking-wider hover:scale-105 transition-transform duration-300 font-serif text-white flex-shrink-0"
        >
          Crafty<span>.</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 ml-12">
          {["Home", "Shop", "Product", "Wishlist", "Contact Us"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(" ", "-")}`}
              className={`text-base font-medium whitespace-nowrap transform hover:-translate-y-1 hover:scale-110 transition-all duration-300 ease-in-out text-white`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Section: Search, Sort, and Icons */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Enhanced Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchResults}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-64 py-2 px-4 pr-12 rounded-full bg-white/90 backdrop-blur-sm border-2 
                transition-all duration-300 ease-in-out
                ${
                  isFocused
                    ? "w-80 border-white shadow-lg bg-white"
                    : "border-transparent"
                } 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50`}
            />
            <button
              aria-label="Search"
              onClick={handlesearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 
                p-1.5 rounded-full transition-all duration-300 ease-in-out
                ${isFocused ? "bg-[#EBBE43] text-white" : "text-gray-400"}
                hover:bg-[#D4A833] hover:text-white`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Button */}
          <button
            onClick={handleSortClick}
            className="px-4 py-2 text-sm font-semibold text-white transition duration-300 transform bg-[#EBBE43] rounded-lg shadow-md hover:bg-[#D4A833] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4A833] flex items-center gap-2"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/74d610171b49cc3b18b456fe06d02bff2a8f09126ee10249b3afcbc71e046e51?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&"
              alt="Sort Icon"
              className="w-4 h-4"
            />
            {isDescending ? "Sort: High to Low" : "Sort: Low to High"}
          </button>

          {/* Account Icon */}
          <button
            aria-label="Account"
            className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <User className="w-6 h-6 text-white" />
          </button>

          {/* Cart Icon */}
          <button
            aria-label="Cart"
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
