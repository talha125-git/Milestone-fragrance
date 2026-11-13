import React, { useState } from 'react';
import {
  Star,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  MapPin,
  Tag,
} from 'lucide-react';

export default function ReviewsTab({
  reviews = [],
  onDeleteReview,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  // Metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
      : '0.0';
  const fiveStarCount = reviews.filter((r) => Math.round(Number(r.rating) || 5) === 5).length;
  const verifiedCount = reviews.filter((r) => r.verified !== false).length;

  // Extract unique products from reviews
  const uniqueProducts = Array.from(
    new Set(reviews.map((r) => r.productName || r.productId).filter(Boolean))
  );

  // Filtered reviews
  const filteredReviews = reviews.filter((rev) => {
    // Rating match
    if (ratingFilter !== 'all') {
      if (Math.round(Number(rev.rating) || 5) !== Number(ratingFilter)) {
        return false;
      }
    }

    // Product match
    if (productFilter !== 'all') {
      const pName = rev.productName || rev.productId || '';
      if (pName.toLowerCase() !== productFilter.toLowerCase()) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = rev.name?.toLowerCase().includes(q);
      const matchEmail = rev.email?.toLowerCase().includes(q);
      const matchCity = rev.city?.toLowerCase().includes(q);
      const matchTitle = rev.title?.toLowerCase().includes(q);
      const matchComment = rev.comment?.toLowerCase().includes(q);
      const matchProduct = (rev.productName || rev.productId)?.toLowerCase().includes(q);
      if (
        !matchName &&
        !matchEmail &&
        !matchCity &&
        !matchTitle &&
        !matchComment &&
        !matchProduct
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            {totalReviews}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Across all fragrance collections</p>
        </div>

        {/* Average Rating */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              {avgRating}
            </span>
            <span className="text-xs text-stone-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Customer satisfaction score</p>
        </div>

        {/* 5-Star Reviews */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">5-Star Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            {fiveStarCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {totalReviews > 0
              ? `${Math.round((fiveStarCount / totalReviews) * 100)}% of total ratings`
              : 'Highest rating tier'}
          </p>
        </div>

        {/* Verified Buyers */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Buyers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            {verifiedCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Authentic buyer submissions</p>
        </div>
      </div>

      {/* 2. MAIN CARD: SEARCH, FILTER & REVIEWS LIST */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Customer Reviews Feed</span>
              <span className="text-xs font-sans font-bold bg-[#dfb76c]/20 text-[#855f19] px-2.5 py-0.5 rounded-full">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Review and moderate feedback submitted by customers on the storefront.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:bg-white transition-all"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 font-medium focus:outline-none focus:border-[#dfb76c] cursor-pointer"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>

            {/* Product Filter */}
            {uniqueProducts.length > 0 && (
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 font-medium focus:outline-none focus:border-[#dfb76c] cursor-pointer"
              >
                <option value="all">All Fragrances</option>
                {uniqueProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 text-stone-400" />
            </div>
            <h4 className="font-serif text-base font-bold text-stone-800">No Reviews Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {reviews.length === 0
                ? 'No customer reviews have been submitted yet. Verified customer submissions will appear here.'
                : 'No reviews match your current search and filter criteria.'}
            </p>
            {(searchQuery || ratingFilter !== 'all' || productFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setRatingFilter('all');
                  setProductFilter('all');
                }}
                className="text-xs text-[#b38531] font-semibold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredReviews.map((rev) => {
              const initials = rev.name
                ? rev.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'VIP';

              const rRating = Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5)));

              return (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 hover:bg-stone-50/60 transition-colors space-y-3"
                >
                  {/* Top Bar: Reviewer Info, Fragrance Name, Rating & Delete Action */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1b1712] border border-[#dfb76c] text-[#dfb76c] font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                        {initials}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{rev.name}</span>
                          {rev.verified !== false && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-2 mt-0.5">
                          {rev.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-400" />
                              <span>{rev.email}</span>
                            </span>
                          )}
                          {rev.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              <span>{rev.city}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-stone-400">
                            <Calendar className="w-3 h-3" />
                            <span>{rev.date || 'Recent'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Star Rating & Delete Action */}
                    <div className="flex items-center gap-3">
                      {/* Stars */}
                      <div className="flex text-[#dfb76c]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rRating
                                ? 'fill-[#dfb76c] text-[#dfb76c]'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDeleteReview(rev.id, rev.name)}
                        title="Delete this review"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fragrance Tag & Highlight */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a651c] bg-[#dfb76c]/15 border border-[#dfb76c]/30 px-2.5 py-0.5 rounded-md">
                      <Tag className="w-3 h-3" />
                      <span>Fragrance: {rev.productName || rev.productId || 'Milestone Fragrance'}</span>
                    </span>

                    {rev.performance && (
                      <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
                        {rev.performance}
                      </span>
                    )}
                  </div>

                  {/* Review Title & Detailed Comment */}
                  <div className="space-y-1">
                    {rev.title && (
                      <h4 className="font-serif font-bold text-stone-900 text-sm">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/60 whitespace-pre-line">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

