import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { products as defaultProducts } from '../data/products';

export default function Women({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onOpenQuickView,
  products: passedProducts,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;

  const womenProducts = productList.filter((p) => {
    const g = p.gender ? p.gender.toLowerCase() : '';
    return g === 'women' || g === 'unisex';
  });

  const filtered = womenProducts.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.type.toLowerCase() === selectedFilter.toLowerCase();
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            WOMEN'S COLLECTION
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            Graceful, Radiant & Mesmerizing
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light">
            Blended with enchanting blooms of Grasse roses, delicate jasmine, and sunlit citrus.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'fresh', 'citrus', 'woody'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`text-xs px-4 py-2 rounded-full capitalize transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#dfb76c] text-black font-semibold'
                    : 'bg-[#181410] text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                {filter === 'all' ? 'All Scents' : filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <SlidersHorizontal className="w-4 h-4 text-[#dfb76c]" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181410] text-stone-200 border border-stone-800 rounded px-2.5 py-1.5 focus:border-[#dfb76c] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sorted.map((product) => {
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
                  className="relative aspect-square w-full rounded-lg bg-[#FAF6F0] mb-4 flex items-center justify-center cursor-pointer p-2 overflow-hidden"
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
                  ) : null}
                  <span className="absolute bottom-2 left-2 bg-black/80 text-[#dfb76c] text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                    {product.type}
                  </span>
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

                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-[#dfb76c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#dfb76c] text-[#dfb76c]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-400">({product.reviewsCount})</span>
                    </div>

                    <div className="text-white font-bold text-sm mb-4">
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

