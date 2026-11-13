import React, { useState, useEffect } from 'react';
import {
  Star,
  PenSquare,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { loadStoredReviews, persistReviews } from '../data/reviews';

export default function ProductReviews({
  product,
  onReviewSubmitted,
}) {
  const [reviews, setReviews] = useState(() => loadStoredReviews());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Hover rating on the main page trigger
  const [triggerHoverRating, setTriggerHoverRating] = useState(0);

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
  const [modalHoverRating, setModalHoverRating] = useState(0);

  // Listen to reviews updates
  useEffect(() => {
    const handleUpdate = () => {
      setReviews(loadStoredReviews());
    };
    window.addEventListener('milestone_reviews_updated', handleUpdate);
    return () => window.removeEventListener('milestone_reviews_updated', handleUpdate);
  }, []);

  const productId = product?.id || 'signature';

  // Filter reviews for this specific product (or fallback)
  const productReviews = reviews.filter(
    (r) => r.productId?.toLowerCase() === productId.toLowerCase()
  );

  const displayedReviewsPool = productReviews.length > 0
    ? productReviews
    : reviews.slice(0, 3);

  // Calculate Average Rating & Counts
  const totalReviewsCount = displayedReviewsPool.length;
  const avgRating = totalReviewsCount > 0
    ? (displayedReviewsPool.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const ratingDescriptions = {
    5: 'Exceptional (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average (3/5)',
    2: 'Below Average (2/5)',
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

  // Open modal pre-selected with star rating
  const handleStarClickToOpen = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
    setSubmittedSuccess(false);
    setIsModalOpen(true);
  };

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
      setIsModalOpen(false);
    }, 1800);
  };

  return (
    <section id="reviews-section" className="w-full pt-10 pb-8 border-t border-[#221e1a] text-stone-200">
      <div className="space-y-6">
        {/* Simple & Clean Reviews Header with 5-Star Hover Trigger */}
        <div className="bg-[#14120f] border border-[#262018] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Overall Rating Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#dfb76c] text-[11px] font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOMER REVIEWS</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {avgRating}
              </span>
              <div className="flex text-[#dfb76c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#dfb76c]" />
                ))}
              </div>
              <span className="text-xs text-stone-400">
                ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Verified buyers sharing longevity, sillage & scent performance for <strong className="text-stone-200">{product?.name}</strong>.
            </p>
          </div>

          {/* Right: Interactive 5 Stars Hover & Click Trigger */}
          <div className="bg-[#181511] border border-[#2e261d] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-left shadow-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block mb-1">
                Rate & Review This Perfume:
              </span>
              {/* 5 Stars with Hover Transition */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setTriggerHoverRating(star)}
                    onMouseLeave={() => setTriggerHoverRating(0)}
                    onClick={() => handleStarClickToOpen(star)}
                    title={`Click to rate ${star} star${star > 1 ? 's' : ''} and write review`}
                    className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer group"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors duration-150 ${
                        (triggerHoverRating || 0) >= star
                          ? 'fill-[#dfb76c] text-[#dfb76c] drop-shadow-[0_0_8px_rgba(223,183,108,0.5)]'
                          : 'text-stone-600 hover:text-[#dfb76c]'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-[#dfb76c] ml-2 min-w-[90px]">
                  {triggerHoverRating > 0 ? ratingDescriptions[triggerHoverRating] : 'Click to Rate'}
                </span>
              </div>
            </div>

            {/* Direct Button Alternative */}
            <button
              type="button"
              onClick={() => handleStarClickToOpen(5)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.99] text-[#0d0c0a] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL (Opens when hovering and clicking on stars) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-[#14120f] border border-[#b38531]/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <PenSquare className="w-4 h-4 text-[#dfb76c]" />
                    <span>Write a Review</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Reviewing: <strong className="text-white">{product?.name}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center space-y-3 bg-[#181511] rounded-xl border border-emerald-600/40 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white">Review Submitted!</h4>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto">
                    Thank you for your feedback! Your review has been published on this product page and the homepage customer reviews.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  {/* Rating Selector inside modal */}
                  <div className="bg-[#181511] p-3.5 rounded-xl border border-[#2a231b] flex items-center justify-between">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                        Your Rating *
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setModalHoverRating(star)}
                            onMouseLeave={() => setModalHoverRating(0)}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className="p-0.5 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                (modalHoverRating || formData.rating) >= star
                                  ? 'fill-[#dfb76c] text-[#dfb76c]'
                                  : 'text-stone-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#dfb76c]">
                      {ratingDescriptions[modalHoverRating || formData.rating]}
                    </span>
                  </div>

                  {/* Review Headline */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Review Headline / Summary *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unbelievable longevity, lasted all day!"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c]"
                    />
                  </div>

                  {/* Review Body */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Your Detailed Review *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the scent, longevity, projection, and occasion..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] resize-none"
                    />
                  </div>

                  {/* Scent Performance Tag */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Highlight Performance
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {performanceOptions.slice(0, 4).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, performance: opt })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer border ${
                            formData.performance === opt
                              ? 'bg-[#dfb76c] text-[#0d0c0a] font-bold border-[#dfb76c]'
                              : 'bg-[#181511] text-stone-400 border-[#2a231b] hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                        className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#dfb76c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                        City (Pakistan) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lahore, Karachi, Islamabad..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#dfb76c]"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#241e17]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-lg bg-transparent text-stone-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-lg bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
