import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = ["Home", "Shop", "Product", "Blog", "Contact Us"];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#EBBE43] flex flex-col justify-end items-center px-20 pt-20 pb-8 w-full transition-colors duration-300 hover:bg-[#d4a93c] max-md:px-5">
      <div className="flex flex-col w-full max-w-[1120px]">
        {/* Top Section */}
        <div className="flex flex-wrap gap-5 justify-between w-full">
          {/* Logo Section */}
          <div className="flex gap-8 items-center">
            <Link
              to="/"
              className="text-white text-2xl font-medium leading-none text-center hover:scale-105 transition-transform duration-300"
            >
              Crafty<span className="text-white">.</span>
            </Link>
            <div className="flex shrink-0 w-px h-6 bg-white/80" />
            <p className="text-white text-sm leading-loose opacity-90 hover:opacity-100 transition-opacity duration-300">
              Crafts & Craft hand Store
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-10 self-start text-sm leading-loose">
            {footerLinks.map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase().replace(" ", "-")}`}
                className="text-white hover:text-white/80 transition-colors duration-300 transform hover:-translate-y-0.5"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-wrap gap-10 justify-center py-4 mt-14 w-full text-xs font-semibold leading-loose border-t border-white/20 max-md:mt-10">
          {/* Copyright and Policy Links */}
          <div className="flex flex-wrap gap-7 self-start items-center">
            <p className="text-white/90">
              Copyright © {currentYear} 3legant. All rights reserved
            </p>
            <Link
              to="/privacy-policy"
              className="text-white hover:text-white/80 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="text-white hover:text-white/80 transition-colors duration-300"
            >
              Terms of Use
            </Link>
          </div>

          {/* Payment Methods Image */}
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/2e230cf2d163f049f36ea1b39e44c455fbfbe2083eee0eeaf72a5ceef9613eae?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&"
            alt="Payment methods"
            className="object-contain shrink-0 max-w-full aspect-[5] w-[120px] hover:opacity-90 transition-opacity duration-300"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
