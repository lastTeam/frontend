import React, { useState, useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/474x/60/0d/47/600d473c1405db545fad6afe21e505e8.jpg"
          alt="Crafty Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div
            className={`max-w-4xl transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main Heading */}
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight tracking-tight md:tracking-tighter">
              Expertly Made
              <span className="text-[#EBBE43]"> / </span>
              <br />
              <span className="text-[#EBBE43]">Remarkably Original.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Welcome to Crafty, where Tunisian traditions meet contemporary
              craft. Established in 2019, we bring you handcrafted treasures
              that tell stories of our rich heritage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group flex items-center gap-2 bg-[#EBBE43] text-black px-6 py-3 rounded-full font-medium transition-all hover:bg-[#d4a93c]">
                Explore Collection
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all hover:bg-white/20">
                Our Story
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Floating Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
              {[
                { label: "Artisans", value: "50+" },
                { label: "Products", value: "200+" },
                { label: "Years of Craft", value: "5+" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center transition-all duration-1000 delay-${
                    index * 200
                  } ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="text-[#EBBE43] text-3xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
