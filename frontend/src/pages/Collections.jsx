import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { products as defaultProducts, fragranceTypes } from '../data/products';

export default function Collections({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  selectedType = 'all',
  setSelectedType,
  products: passedProducts,
}) {
  const { type } = useParams();
  const navigate = useNavigate();

  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;

  // If URL has :type param, prioritize it; otherwise use selectedType prop
  const currentFilter = (type || selectedType || 'all').toLowerCase();

  const handleFilterClick = (filterName) => {
    if (setSelectedType) setSelectedType(filterName);
    if (filterName.toLowerCase() === 'all') {
      navigate('/collections');
    } else {
      navigate(`/collections/${encodeURIComponent(filterName.toLowerCase())}`);
    }
  };

  const filtered = productList.filter((p) => {
    if (currentFilter === 'all') return true;
    return (p.type || '').toLowerCase() === currentFilter;
  });

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> LUXURY ATELIER
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            The Milestone Collections
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Every bottle is an ode to high perfumery. Handcrafted with high oil concentrations (25%+ Extrait/EDP) for exceptional projection and 12+ hour longevity.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          <button
            onClick={() => handleFilterClick('all')}
            className={`text-xs px-5 py-2 rounded-full transition-colors cursor-pointer ${
              currentFilter === 'all'
                ? 'bg-[#dfb76c] text-black font-semibold'
                : 'bg-[#181410] text-stone-300 hover:text-white border border-stone-800'
            }`}
          >
            All Collections ({productList.length})
          </button>
          {fragranceTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleFilterClick(t.name)}
              className={`text-xs px-5 py-2 rounded-full transition-colors cursor-pointer ${
                currentFilter === t.name.toLowerCase()
                  ? 'bg-[#dfb76c] text-black font-semibold'
                  : 'bg-[#181410] text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
          {filtered.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-[#14120f] rounded-xl border border-[#262018] hover:border-[#dfb76c] p-3 sm:p-4 transition-all duration-300 hover:shadow-xl relative"
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
                    className={`w-full h-full object-contain p-1 transition-all duration-500 ${
                      product.hoverImage
                        ? 'group-hover:opacity-0 group-hover:scale-105'
                        : 'group-hover:scale-105'
                    }`}
                  />
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} hover view`}
                      className="absolute inset-0 w-full h-full object-contain p-1 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  )}
                  {product.inStock === false ? (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                      Out of Stock
                    </span>
                  ) : product.isNewArrival ? (
                    <span className="absolute top-2 left-2 bg-[#dfb76c] text-[#0d0c0a] font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                      ★ New Arrival
                    </span>
                  ) : product.bestSeller ? (
                    <span className="absolute top-2 left-2 bg-[#dfb76c] text-black font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">
                      Bestseller
                    </span>
                  ) : null}
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

                  {product.inStock === false ? (
                    <button
                      disabled
                      className="w-full bg-stone-900 text-stone-500 text-xs font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 border border-stone-800 cursor-not-allowed opacity-70"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Out of Stock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-[#1e1913] hover:bg-[#dfb76c] hover:text-black text-white text-xs font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

