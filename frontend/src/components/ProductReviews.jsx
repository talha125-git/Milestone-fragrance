import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  PenSquare,
  Filter,
  Sparkles,
  ChevronDown,
  X,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { loadStoredReviews, persistReviews } from '../data/reviews';

export default function ProductReviews({
  product,
  onReviewSubmitted,
}) {
  const [reviews, setReviews] = useState(() => loadStoredReviews());
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [helpfulClicked, setHelpfulClicked] = useState(new Set());
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: 'Lahore',
    rating: 5,
    title: '',
    comment: '',
    performance: '12+ Hours Longevity',
  });
  const [hoverRating, setHoverRating] = useState(0);

  // Listen to reviews updates
  useEffect(() => {
    const handleUpdate = () => {
      setReviews(loadStoredReviews());
    };
    window.addEventListener('milestone_reviews_updated', handleUpdate);
    return () => window.removeEventListener('milestone_reviews_updated', handleUpdate);
  }, []);

  const productId = product?.id || 'signature';

  // Filter reviews for this specific product (or generic milestone reviews if newly created product has few)
  const productReviews = reviews.filter(
    (r) => r.productId?.toLowerCase() === productId.toLowerCase()
  );

  // Fallback to show at least 2 general reviews if product has 0 reviews yet
  const displayedReviewsPool = productReviews.length > 0
    ? productReviews
    : reviews.slice(0, 3);

  // Calculate Average Rating & Counts
  const totalReviewsCount = displayedReviewsPool.length;
  const avgRating = totalReviewsCount > 0
    ? (displayedReviewsPool.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  displayedReviewsPool.forEach((r) => {
    const rStar = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    starCounts[rStar] = (starCounts[rStar] || 0) + 1;
  });

  // Filter & Sort
  const filteredReviews = displayedReviewsPool.filter((r) => {
    if (selectedStarFilter === 'all') return true;
    return Math.round(r.rating || 5) === Number(selectedStarFilter);
  });

  filteredReviews.sort((a, b) => {
    if (sortBy === 'highest') return (b.rating || 5) - (a.rating || 5);
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  const ratingDescriptions = {
    5: 'Exceptional Extrait (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average Scent (3/5)',
    2: 'Below Expectations (2/5)',
    1: 'Needs Improvement (1/5)',
  };

  const performanceOptions = [
    '12+ Hours Longevity',
    'Huge Compliment Magnet',
    'Massive Sillage & Projection',
    'Smooth & Rich French Blend',
    'Office & Everyday Safe',
    'Regal Royal Aura',
  ];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newReview = {
      id: `rev-${Date.now()}`,
      productId: productId.toLowerCase(),
      productName: product?.name || 'Milestone Fragrance',
      name: formData.name.trim(),
      email: formData.email.trim(),
      city: formData.city.trim() || 'Pakistan',
      rating: formData.rating,
      title: formData.title.trim() || 'Verified Customer Review',
      comment: formData.comment.trim(),
      performance: formData.performance,
      verified: true,
      helpful: 1,
      date: formattedDate,
      createdAt: now.toISOString(),
    };

    const updatedList = [newReview, ...reviews];
    setReviews(updatedList);
    persistReviews(updatedList);

    // Also send to backend API
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    }).catch(() => {});

    setSubmittedSuccess(true);
    setFormData({
      name: '',
      email: '',
      city: 'Lahore',
      rating: 5,
      title: '',
      comment: '',
      performance: '12+ Hours Longevity',
    });

    if (onReviewSubmitted) {
      onReviewSubmitted(newReview);
    }

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsWriteOpen(false);
    }, 2500);
  };

  const handleHelpfulClick = (reviewId) => {
    if (helpfulClicked.has(reviewId)) return;

    setHelpfulClicked((prev) => new Set([...prev, reviewId]));

    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
      );
      persistReviews(updated);
      return updated;
    });

    fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' }).catch(() => {});
  };

  return (
    <section id="reviews-section" className="w-full pt-12 pb-8 border-t border-[#221e1a] text-stone-200">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#221e1a]">
          <div>
            <div className="flex items-center gap-1.5 text-[#dfb76c] text-[11px] font-semibold tracking-[0.2em] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTIC CUSTOMER EXPERIENCES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
              Customer Reviews
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Verified buyers sharing performance, longevity, and sillage of <strong className="text-stone-200">{product?.name}</strong>.
            </p>
          </div>

          {/* Write a Review Button */}
          <button
            type="button"
            onClick={() => {
              setIsWriteOpen((prev) => !prev);
              setSubmittedSuccess(false);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#dfb76c] via-[#f3cf88] to-[#dfb76c] hover:brightness-110 active:scale-[0.99] text-[#0d0c0a] text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <PenSquare className="w-4 h-4" />
            <span>{isWriteOpen ? 'Close Review Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Aggregated Rating Breakdown Card (PerfumePlus / Judge.me style) */}
        <div className="bg-[#14120f] border border-[#262018] rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Score Column */}
            <div className="md:col-span-4 text-center md:text-left md:border-r md:border-[#262018] md:pr-6 space-y-2">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                {avgRating} <span className="text-lg text-stone-500 font-sans font-normal">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-[#dfb76c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#dfb76c]" />
                ))}
              </div>
              <p className="text-xs text-stone-400">
                Based on <strong className="text-white">{totalReviewsCount}</strong> verified customer reviews
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Authentic Extrait Buyers</span>
              </div>
            </div>

            {/* Middle Star Breakdown Progress Bars */}
            <div className="md:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star] || 0;
                const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                const isFilterActive = selectedStarFilter === String(star);

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStarFilter(isFilterActive ? 'all' : String(star))}
                    className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded transition-colors ${
                      isFilterActive ? 'bg-[#221c15]' : 'hover:bg-[#1a1713]'
                    }`}
                  >
                    <span className="w-12 text-stone-300 font-semibold flex items-center gap-1">
                      <span>{star}</span>
                      <Star className="w-3 h-3 fill-[#dfb76c] text-[#dfb76c]" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-[#201b15] overflow-hidden border border-[#2a231b]">
                      <div
                        className="h-full bg-gradient-to-r from-[#b38531] to-[#dfb76c] transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-14 text-right text-stone-400 text-[11px]">
                      {count} ({percentage}%)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Value Proposition */}
            <div className="md:col-span-3 text-xs text-stone-400 space-y-2.5 bg-[#181511] p-4 rounded-xl border border-[#262018]">
              <span className="text-[10px] uppercase font-bold text-[#dfb76c] tracking-wider block">
                Atelier Guarantee
              </span>
              <p className="leading-snug">
                Every review represents real experiences from customers who ordered Milestone Extrait de Parfum.
              </p>
              <div className="flex items-center gap-1.5 text-stone-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Packaging & Longevity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible "Write a Review" Form Drawer */}
        {isWriteOpen && (
          <div className="bg-[#14120f] border border-[#b38531]/40 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <PenSquare className="w-4 h-4 text-[#dfb76c]" />
                  <span>Share Your Experience with {product?.name}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Your feedback helps fellow fragrance enthusiasts discover their signature scent.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWriteOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3 bg-[#181511] rounded-xl border border-emerald-600/40 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">Thank You For Your Review!</h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  Your review has been successfully submitted and added to both the {product?.name} product page and our homepage customer testimonials!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
                {/* 1. Rating Stars Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Overall Scent Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || formData.rating) >= star
                                ? 'fill-[#dfb76c] text-[#dfb76c]'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#dfb76c] ml-2">
                      {ratingDescriptions[hoverRating || formData.rating]}
                    </span>
                  </div>
                </div>

                {/* 2. Review Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Review Headline / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unbelievable longevity, stayed on my jacket for 2 days!"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                  />
                </div>

                {/* 3. Detailed Review */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Detailed Review / Scent Story *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how the fragrance opened, projection, notes, and how long it lasted throughout your day..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors resize-none"
                  />
                </div>

                {/* 4. Scent Performance Badge Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Highlight Key Performance
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {performanceOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, performance: opt })}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                          formData.performance === opt
                            ? 'bg-[#dfb76c] text-[#0d0c0a] font-bold border-[#dfb76c]'
                            : 'bg-[#181511] text-stone-400 border-[#2a231b] hover:border-stone-500 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Author Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Tariq"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      City / Location (Pakistan) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lahore, Karachi..."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Email Address (Not Published)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. daniyal@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c]"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteOpen(false)}
                    className="px-5 py-2.5 rounded-lg bg-transparent text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Submit Customer Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Star Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px] uppercase font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['all', '5', '4', '3'].map((star) => {
              const isSelected = selectedStarFilter === star;
              const count = star === 'all' ? displayedReviewsPool.length : (starCounts[star] || 0);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStarFilter(star)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#dfb76c] text-[#0d0c0a]'
                      : 'bg-[#181511] text-stone-400 border border-[#262018] hover:text-white hover:border-stone-600'
                  }`}
                >
                  {star === 'all' ? 'All Reviews' : `${star} Stars`} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#14120f] border border-[#262018] text-stone-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#dfb76c] cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Customer Reviews Feed */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-[#14120f] border border-[#262018] rounded-xl text-stone-400">
              <MessageSquare className="w-8 h-8 mx-auto text-stone-600 mb-2" />
              <p className="font-serif text-sm text-stone-300">No reviews match the selected filter.</p>
              <button
                type="button"
                onClick={() => setSelectedStarFilter('all')}
                className="text-xs text-[#dfb76c] hover:underline mt-1 font-semibold"
              >
                Clear Filter & View All Reviews
              </button>
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const initials = rev.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={rev.id}
                  className="bg-[#14120f] border border-[#262018] hover:border-[#382f23] rounded-xl p-5 sm:p-6 transition-all duration-300 space-y-3.5 shadow-md"
                >
                  {/* Top Bar: Reviewer Avatar, Name, Verification, Rating & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar with Luxury Gold Border */}
                      <div className="w-10 h-10 rounded-full bg-[#1b1712] border border-[#dfb76c]/40 text-[#dfb76c] font-bold flex items-center justify-center text-xs shadow-inner">
                        {initials || 'VIP'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-white text-sm">
                            {rev.name}
                          </span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {rev.city || 'Pakistan'} • <span className="text-stone-500">{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stars & Performance Badge */}
                    <div className="flex flex-col sm:items-end gap-1">
                      <div className="flex text-[#dfb76c]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#dfb76c]" />
                        ))}
                      </div>
                      {rev.performance && (
                        <span className="text-[10px] font-semibold text-[#dfb76c] bg-[#dfb76c]/10 border border-[#dfb76c]/20 px-2 py-0.2 rounded-full">
                          {rev.performance}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1.5">
                    {rev.title && (
                      <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-stone-300 text-xs sm:text-[13px] font-light leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Bottom Bar: Helpful Thumbs Up */}
                  <div className="pt-2 border-t border-[#201c17] flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] text-stone-500">
                      Purchased: <strong className="text-stone-300 font-medium">{rev.productName || product?.name}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                        helpfulClicked.has(rev.id)
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-[#181511] hover:bg-[#201c17] text-stone-400 hover:text-white border border-[#262018]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpful || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

