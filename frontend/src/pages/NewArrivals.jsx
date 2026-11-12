import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, SlidersHorizontal, Sparkles } from 'lucide-react';
import { products as defaultProducts } from '../data/products';

export default function NewArrivals({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  products: passedProducts,
}) {
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const productList = passedProducts && passedProducts.length > 0 ? passedProducts : defaultProducts;

  // Filter for products marked as new arrivals
  // If no products are marked, fallback to the latest products so page is never completely blank
  const rawArrivals = productList.filter((p) => Boolean(p.isNewArrival));
  const newArrivalsList = rawArrivals.length > 0 ? rawArrivals : productList.slice(0, 4);

  // Gender filter
  const genderFiltered = newArrivalsList.filter((p) => {
    if (selectedGender === 'all') return true;
    const g = p.gender ? p.gender.toLowerCase() : '';
    return g === selectedGender.toLowerCase() || g === 'unisex';
  });

  // Type filter
  const typeFiltered = genderFiltered.filter((p) => {
    if (selectedType === 'all') return true;
    return (p.type || '').toLowerCase() === selectedType.toLowerCase();
  });

  // Sorting
  const sorted = [...typeFiltered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JUST LAUNCHED 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            New Fragrance Arrivals
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Experience our newest artisanal olfactory creations. Freshly composed, aged, and bottled for the modern connoisseur.
          </p>
        </div>

        {/* Filter and Sorting Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-800">
          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { label: 'All Arrivals', value: 'all' },
              { label: 'For Him', value: 'men' },
              { label: 'For Her', value: 'women' },
              { label: 'Unisex', value: 'unisex' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedGender(tab.value)}
                className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGender === tab.value
                    ? 'bg-[#dfb76c] text-black font-semibold shadow-xs'
                    : 'bg-[#181410] text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scent Family & Sorting Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <span>Family:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#181410] text-stone-200 border border-stone-800 rounded px-2.5 py-1.5 focus:border-[#dfb76c] focus:outline-none cursor-pointer"
              >
                <option value="all">All Fragrance Families</option>
                <option value="woody">Woody</option>
                <option value="fresh">Fresh</option>
                <option value="floral">Floral</option>
                <option value="citrus">Citrus</option>
                <option value="sweet">Sweet</option>
                <option value="fruity">Fruity</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#181410] text-stone-200 border border-stone-800 rounded px-2.5 py-1.5 focus:border-[#dfb76c] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
            {sorted.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-[#14120f] rounded-xl border border-[#262018] hover:border-[#dfb76c] p-3 sm:p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 relative"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    aria-label="Wishlist"
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-stone-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-xs focus:outline-none cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 stroke-[1.8] ${
                        isWishlisted ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>

                  {/* Product Bottle Stage */}
                  <div
                    onClick={() => onOpenQuickView(product)}
                    className="relative aspect-square w-full rounded-lg bg-[#FAF6F0] mb-3 flex items-center justify-center cursor-pointer p-2 overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* NEW ARRIVAL Badge */}
                    <span className="absolute top-2 left-2 bg-[#dfb76c] text-[#0d0c0a] font-bold text-[9px] uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1 tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>New Arrival</span>
                    </span>

                    {/* Fragrance Family Badge */}
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[#dfb76c] text-[10px] uppercase font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                      {product.type}
                    </span>
                  </div>

                  {/* Content */}
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

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-[#dfb76c]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#dfb76c] text-[#dfb76c]" />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400">({product.reviewsCount || 12})</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-white font-bold text-sm">
                          Rs. {Number(product.price).toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-stone-500 line-through text-xs">
                            Rs. {Number(product.originalPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
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
        ) : (
          <div className="text-center py-16 bg-[#14120f] rounded-2xl border border-stone-800 p-8 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-[#dfb76c] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold text-white mb-2">No Fragrances Found</h3>
            <p className="text-stone-400 text-xs mb-6">
              No new arrivals match the current filter selection. Try selecting "All Arrivals" or a different fragrance family.
            </p>
            <button
              onClick={() => {
                setSelectedGender('all');
                setSelectedType('all');
              }}
              className="px-5 py-2 rounded-full bg-[#dfb76c] text-black font-semibold text-xs cursor-pointer hover:bg-[#f0c87d] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

