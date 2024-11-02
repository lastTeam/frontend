import * as React from "react";

export function Newsletter() {
  return (
    <section className="flex flex-col w-full font-medium text-neutral-900 max-md:max-w-full">
      <div className="relative flex flex-col justify-center items-center px-20 py-24 w-full min-h-[360px] max-md:px-5 max-md:pt-24 max-md:max-w-full">
        {/* Background image with overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            loading="lazy"
            src="https://i.pinimg.com/564x/ed/b6/55/edb6556563cf5b35a5decb788dc05445.jpg"
            alt="Traditional Tunisian pottery and handicrafts"
            className="object-cover w-full h-full"
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative flex flex-col items-center max-w-full w-[488px] z-10">
          <h2 className="text-4xl font-bold tracking-tight leading-none text-center text-[#EBBE43] mb-4">
            Join Our Newscrafts
          </h2>
          <p className="mt-2 text-lg leading-loose text-center text-[#EBBE43]">
            Sign up for deals, new products and promotions
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center items-center self-stretch py-3 mt-8 w-full text-base tracking-tight leading-7 border-b border-solid border-[#EBBE43]">
            <div className="flex gap-2 flex-1 w-full">
              <div className="flex items-center px-3 py-2 bg-black/20 rounded-lg w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#EBBE43]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  className="ml-2 w-full bg-transparent border-none outline-none placeholder-[#EBBE43]/80 text-[#EBBE43]"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#EBBE43] text-black rounded-lg hover:bg-[#EBBE43]/90 transition-colors duration-200 font-medium"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
