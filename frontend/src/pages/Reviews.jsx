import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  Calendar,
  MapPin,
} from 'lucide-react';
import { loadStoredReviews } from '../data/reviews';

export default function Reviews({ onSelectProduct }) {
  const navigate = useNavigate();
  const [reviewsList, setReviewsList] = useState(() => loadStoredReviews());
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  const [selectedStarFilter, setSelectedStarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Sync real-time updates
  useEffect(() => {
    const handleUpdate = () => {
      setReviewsList(loadStoredReviews());
    };
    window.addEventListener('milestone_reviews_updated', handleUpdate);
    return () => window.removeEventListener('milestone_reviews_updated', handleUpdate);
  }, []);

  // Unique products present in reviews
  const uniqueProducts = Array.from(
    new Set(reviewsList.map((r) => r.productName || r.productId).filter(Boolean))
  );

  // Overall metrics
  const totalReviewsCount = reviewsList.length;
  const avgRating =
    totalReviewsCount > 0
      ? (
          reviewsList.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
          totalReviewsCount
        ).toFixed(1)
      : '5.0';

  const fiveStarCount = reviewsList.filter(
    (r) => Math.round(Number(r.rating) || 5) === 5
  ).length;

  // Filtered list
  const filtered = reviewsList.filter((rev) => {
    if (selectedStarFilter !== 'all') {
      if (Math.round(Number(rev.rating) || 5) !== Number(selectedStarFilter)) {
        return false;
      }
    }
    if (selectedProductFilter !== 'all') {
      const pName = rev.productName || rev.productId || '';
      if (pName.toLowerCase() !== selectedProductFilter.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'highest') {
      return (Number(b.rating) || 5) - (Number(a.rating) || 5);
    }
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> VERIFIED REVIEWS
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            Words of Connoisseurs
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Authentic reviews and fragrance impressions from verified customers wearing Milestone Extrait de Parfum across Pakistan.
          </p>
        </div>

        {/* Overall Rating Banner */}
        <div className="bg-[#14120f] border border-[#262018] rounded-2xl p-6 sm:p-8 mb-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#dfb76c] uppercase tracking-wider">
              Customer Satisfaction
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                {avgRating}
              </span>
              <div className="flex text-[#dfb76c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#dfb76c]" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-stone-400">
                ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {totalReviewsCount > 0
                ? `${fiveStarCount} customers rated their fragrance experience 5 out of 5 stars.`
                : 'Be the first connoisseur to review a Milestone fragrance.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.98] text-[#0d0c0a] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#dfb76c]/20 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-[#0d0c0a]" />
              <span>Explore Fragrances</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#14120f] border border-[#262018] rounded-xl p-4">
          {/* Star Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px] uppercase font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#dfb76c]" /> Rating:
            </span>
            {['all', '5', '4', '3'].map((star) => {
              const isSelected = selectedStarFilter === star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStarFilter(star)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#dfb76c] text-[#0d0c0a]'
                      : 'bg-[#181511] text-stone-400 border border-[#262018] hover:text-white hover:border-stone-600'
                  }`}
                >
                  {star === 'all' ? 'All Ratings' : `${star} Stars`}
                </button>
              );
            })}
          </div>

          {/* Fragrance Dropdown & Sort */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {uniqueProducts.length > 0 && (
              <select
                value={selectedProductFilter}
                onChange={(e) => setSelectedProductFilter(e.target.value)}
                className="bg-[#181511] border border-[#262018] text-stone-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#dfb76c] cursor-pointer"
              >
                <option value="all">All Fragrances</option>
                {uniqueProducts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181511] border border-[#262018] text-stone-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#dfb76c] cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#14120f] border border-[#262018] rounded-2xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1b1712] border border-[#dfb76c]/40 text-[#dfb76c] flex items-center justify-center mx-auto">
              <Star className="w-7 h-7 fill-[#dfb76c]/20" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              {totalReviewsCount === 0 ? 'No Reviews Yet' : 'No Reviews Match Filters'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
              {totalReviewsCount === 0
                ? 'Be the first to review your favorite Milestone Extrait de Parfum fragrance. Reviews submitted on product pages will appear here.'
                : 'Try resetting your star or fragrance filter to see more reviews.'}
            </p>
            {totalReviewsCount > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedStarFilter('all');
                  setSelectedProductFilter('all');
                }}
                className="text-xs text-[#dfb76c] hover:underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2"
              >
                <span>Discover Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rev) => {
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
                  className="bg-[#14120f] border border-[#262018] hover:border-[#dfb76c]/60 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-black/70 group"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, Verified Badge & Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#1b1712] border border-[#dfb76c]/50 text-[#dfb76c] font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-inner">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-white text-sm">
                              {rev.name}
                            </span>
                            {rev.verified !== false && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.2 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-500" />
                            <span>{rev.city || 'Pakistan'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex text-[#dfb76c]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rRating
                                ? 'fill-[#dfb76c] text-[#dfb76c]'
                                : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Fragrance Reviewed Pill */}
                    <div>
                      <span className="inline-block text-[10px] font-semibold text-[#dfb76c] bg-[#dfb76c]/10 border border-[#dfb76c]/20 px-2.5 py-0.5 rounded-full">
                        Fragrance: {rev.productName || rev.productId || 'Milestone Fragrance'}
                      </span>
                    </div>

                    {/* Review Title & Content */}
                    <div className="space-y-1">
                      {rev.title && (
                        <h4 className="font-serif font-bold text-stone-100 text-sm leading-snug">
                          {rev.title}
                        </h4>
                      )}
                      <p className="text-stone-300 text-xs sm:text-[13px] font-light leading-relaxed italic line-clamp-6">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Footer Date */}
                  <div className="pt-3 mt-4 border-t border-[#201c17] flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-600" />
                      <span>{rev.date || 'Recent'}</span>
                    </span>
                    <span className="text-emerald-500/80 font-medium text-[10px]">
                      100% Extrait Buyer
                    </span>
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

