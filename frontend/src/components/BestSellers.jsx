import React from 'react';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { products as defaultProducts } from '../data/products';

export default function BestSellers({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  onViewAll,
  products: passedProducts,
}) {
  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;
  return (
    <section className="w-full bg-[#FAF6F0] text-stone-900 py-14 sm:py-20 border-b border-[#e5ded2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <p className="text-stone-700 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase mb-1">
              BEST SELLERS
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900">
              Most Loved Fragrances
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-800 hover:text-[#b38531] transition-colors focus:outline-none cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
          {productList.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-lg border border-stone-200/90 hover:border-stone-400 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 relative text-center"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  aria-label="Wishlist"
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-xs focus:outline-none cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.8] ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div
                  onClick={() => onOpenQuickView(product)}
                  className="relative aspect-[4/3] sm:aspect-square w-full rounded overflow-hidden bg-[#FAF6F0] mb-3 flex items-center justify-center cursor-pointer group-hover:opacity-95"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.isNewArrival && (
                    <span className="absolute top-2 left-2 bg-[#dfb76c] text-[#0d0c0a] font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                      ★ New Arrival
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between text-center">
                  <div>
                    {/* Title */}
                    <h3
                      onClick={() => onOpenQuickView(product)}
                      className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-[#9e7529] transition-colors cursor-pointer text-center"
                    >
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-stone-500 text-[11px] sm:text-xs leading-snug line-clamp-2 mt-1 mb-2 font-normal text-center">
                      {product.tagline}
                    </p>

                    {/* Star Rating & Review Count */}
                    <div className="flex items-center justify-center gap-1 mb-2.5">
                      <div className="flex text-[#dfb76c]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-[#dfb76c] text-[#dfb76c]"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium">
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="text-stone-900 font-bold text-xs sm:text-sm mb-3 text-center">
                      Rs. {product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-[#161412] hover:bg-[#dfb76c] hover:text-black text-white text-[11px] sm:text-xs font-semibold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

