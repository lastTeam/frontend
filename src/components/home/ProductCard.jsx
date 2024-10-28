import * as React from "react";

export function ProductCard({ product }) {
  const { images, title, basePrice, description, discountPrice } = product;

  const uniqueImages = [...new Set(images)];

  return (
    <article className="flex flex-col relative group mx-2">
      <div className="relative flex flex-col p-4 w-full">
        {uniqueImages?.map((image, index) => (
          <img
            key={index}
            loading="lazy"
            src={image}
            alt={title}
            className="object-cover rounded-lg w-full h-72"
          />
        ))}
        <div className="flex relative gap-5 justify-between w-full mt-4">
          <button
            aria-label="Add to wishlist"
            className="flex gap-2.5 justify-center items-center self-start p-2 w-8 h-8 bg-white shadow-lg rounded-full"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/9ae4fe26caea4ec4b922b3cd752ddc12/3714cfabe2983e4c602cbe5f040355d9cd771c21051eaee0ba27d2338fee59eb?apiKey=9ae4fe26caea4ec4b922b3cd752ddc12&"
              alt=""
              className="object-contain flex-1 w-5 aspect-square"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-3 min-h-[72px]">
        <h3 className="self-stretch mt-1 text-base font-semibold leading-tight text-neutral-900">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm leading-tight">
          {discountPrice ? (
            <>
              <span className="font-semibold text-red-600 line-through">
                D{basePrice}
              </span>
              <span className="font-semibold text-neutral-900">
                D{discountPrice}
              </span>
            </>
          ) : (
            <span className="font-semibold text-neutral-900">D{basePrice}</span>
          )}
        </div>
        <div className="mt-1 text-sm leading-tight text-neutral-700">
          {description}
        </div>
      </div>
      {/* Product Details Button */}
      <button className="mt-4 mb-2 px-6 py-2.5 text-base font-medium tracking-tight leading-7 text-white rounded-lg shadow-lg bg-[#EBBE43] hover:bg-[#D4A833] transition-colors duration-300">
        Product Details
      </button>
    </article>
  );
}
