import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { products as defaultProducts } from '../data/products';

export default function Unisex({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  products: passedProducts,
}) {
  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;
  const unisexProducts = productList.filter((p) => {
    const g = p.gender ? p.gender.toLowerCase() : '';
    return g === 'unisex' || g === 'men' || g === 'women';
  });

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            UNISEX COLLECTION
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            For Everyone. Beyond Boundaries.
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light">
            Harmonious balances of aromatic woods, fresh accords, and warm ambroxan that adapt uniquely to your skin chemistry.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
          {unisexProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-[#14120f] rounded-xl border border-[#262018] hover:border-[#dfb76c] p-3 sm:p-4 transition-all duration-300 relative"
              >
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-stone-400 hover:text-red-500 flex items-center justify-center transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <div
                  onClick={() => onOpenQuickView(product)}
                  className="relative aspect-square w-full rounded-lg bg-[#FAF6F0] mb-3 flex items-center justify-center cursor-pointer p-2 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.isNewArrival && (
                    <span className="absolute top-2 left-2 bg-[#dfb76c] text-[#0d0c0a] font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                      ★ New Arrival
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onOpenQuickView(product)}
                      className="text-base font-serif font-bold text-white group-hover:text-[#dfb76c] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-stone-400 text-xs line-clamp-2 mt-1 mb-2">
                      {product.tagline}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-[#dfb76c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#dfb76c] text-[#dfb76c]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-400">({product.reviewsCount})</span>
                    </div>
                    <div className="text-white font-bold text-sm mb-3">
                      Rs. {product.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-[#1e1913] hover:bg-[#dfb76c] hover:text-black text-white text-xs font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
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
    </div>
  );
}

