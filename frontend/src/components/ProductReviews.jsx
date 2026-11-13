import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  PenSquare,
  Sparkles,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { loadStoredReviews, persistReviews } from '../data/reviews';

const getReviewedProducts = () => {
  try {
    const raw = localStorage.getItem('milestone_reviewed_products');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const markProductAsReviewed = (prodId) => {
  try {
    const list = getReviewedProducts();
    if (!list.includes(prodId.toLowerCase())) {
      list.push(prodId.toLowerCase());
      localStorage.setItem('milestone_reviewed_products', JSON.stringify(list));
    }
  } catch (e) {}
};

const getStoredUserInfo = () => {
  try {
    const raw = localStorage.getItem('milestone_reviewer_info');
    return raw ? JSON.parse(raw) : { name: '', email: '', city: 'Lahore' };
  } catch (e) {
    return { name: '', email: '', city: 'Lahore' };
  }
};

export default function ProductReviews({
  product,
  onReviewSubmitted,
}) {
  const [reviews, setReviews] = useState(() => loadStoredReviews());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 'already_reviewed' | 1 | 2 | 3 | 4

  // Hover state for Step 1 stars
  const [hoverRating, setHoverRating] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: '',
    email: '',
    city: 'Lahore',
  });

  // Listen to reviews updates
  useEffect(() => {
    const handleUpdate = () => {
      setReviews(loadStoredReviews());
    };
    window.addEventListener('milestone_reviews_updated', handleUpdate);
    return () => window.removeEventListener('milestone_reviews_updated', handleUpdate);
  }, []);

  const productId = product?.id || 'signature';

  // Filter reviews for this specific product
  const productReviews = reviews.filter(
    (r) => r.productId?.toLowerCase() === productId.toLowerCase()
  );

  // Calculate Average Rating & Counts
  const totalReviewsCount = productReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (productReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const ratingDescriptions = {
    5: 'Exceptional (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average (3/5)',
    2: 'Below Average (2/5)',
    1: 'Needs Improvement (1/5)',
  };

  const handleOpenModal = () => {
    const reviewedList = getReviewedProducts();
    const alreadyReviewed = reviewedList.includes(productId.toLowerCase());
    const userInfo = getStoredUserInfo();

    setHoverRating(0);
    setFormData({
      rating: 5,
      title: '',
      comment: '',
      name: userInfo.name || '',
      email: userInfo.email || '',
      city: userInfo.city || 'Lahore',
    });

    if (alreadyReviewed) {
      setModalStep('already_reviewed');
    } else {
      setModalStep(1);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStep(1);
  };

  // Step 1: Select rating and move smoothly to Step 2
  const handleSelectRating = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
    setTimeout(() => {
      setModalStep(2);
    }, 180);
  };

  // Step 3 -> Step 4: Submit
  const handleSubmitReview = (e) => {
    if (e) e.preventDefault();
    if (!formData.comment.trim() || !formData.name.trim() || !formData.email.trim()) return;

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
      performance: '',
      verified: true,
      helpful: 1,
      date: formattedDate,
      createdAt: now.toISOString(),
    };

    const updatedList = [newReview, ...reviews];
    setReviews(updatedList);
    persistReviews(updatedList);

    // Mark product as reviewed from this device & remember info
    markProductAsReviewed(productId);
    try {
      localStorage.setItem(
        'milestone_reviewer_info',
        JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
        })
      );
    } catch (err) {}

    // Also send to backend API
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    }).catch(() => {});

    if (onReviewSubmitted) {
      onReviewSubmitted(newReview);
    }

    setModalStep(4);
  };

  return (
    <section id="reviews-section" className="w-full pt-8 pb-4 border-t border-[#221e1a] text-stone-200">
      {/* Product Page Trigger: Rating Summary & "Write a Review" Button */}
      <div className="bg-[#14120f] border border-[#262018] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left: Overall Rating & Scent Note Badge */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-[#dfb76c] text-[11px] font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CUSTOMER EXPERIENCES</span>
          </div>
          <div className="flex items-center gap-3">
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
              {totalReviewsCount > 0 ? (
                <>
                  Read verified customer reviews or share your feedback for{' '}
                  <strong className="text-stone-200">{product?.name}</strong>.
                </>
              ) : (
                <>
                  Be the first to review{' '}
                  <strong className="text-stone-200">{product?.name}</strong>.
                </>
              )}
            </p>
        </div>

        {/* Right: Write a Review Button */}
        <div>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.98] text-[#0d0c0a] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#dfb76c]/20 cursor-pointer whitespace-nowrap"
          >
            <PenSquare className="w-4 h-4 text-[#0d0c0a]" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* POPUP MODAL (PerfumePlus / Judge.me Multi-Step Flow) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-[#14120f] border border-[#dfb76c]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ALREADY REVIEWED PROMPT (Appears if user previously reviewed this product on this device) */}
            {modalStep === 'already_reviewed' && (
              <div className="text-center py-8 sm:py-12 px-2 sm:px-6 space-y-7 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-white text-base sm:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                  You've already reviewed this product from this device. Do you want to write another review?
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1d2922] border-2 border-emerald-500/80 hover:border-emerald-400 text-white font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer hover:bg-[#25362c]"
                  >
                    Write another review
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-transparent border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: Product Image + 5 Stars */}
            {modalStep === 1 && (
              <div className="text-center pt-2 pb-4 space-y-4 animate-in fade-in duration-200">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl bg-[#1b1712] border border-[#2e261e] p-3 flex items-center justify-center shadow-inner">
                  {product?.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <Sparkles className="w-10 h-10 text-[#dfb76c]" />
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    {product?.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-stone-400 mt-0.5">
                    How would you rate this fragrance?
                  </p>
                </div>

                {/* 5 Stars with Smooth Hover */}
                <div
                  className="flex items-center justify-center gap-1.5 py-3"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = (hoverRating || 0) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => handleSelectRating(star)}
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        className="p-1 focus:outline-none cursor-pointer transition-transform"
                      >
                        <Star
                          className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-150 transform ${
                            isLit
                              ? 'fill-[#dfb76c] text-[#dfb76c] scale-115 drop-shadow-[0_0_12px_rgba(223,183,108,0.65)]'
                              : 'text-stone-600 scale-100 hover:text-stone-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Star Description Tooltip */}
                <div className="h-6">
                  <span className="text-xs sm:text-sm font-semibold text-[#dfb76c] transition-opacity duration-150">
                    {hoverRating > 0 ? ratingDescriptions[hoverRating] : 'Select your rating'}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: Review Content (Required) */}
            {modalStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200 text-left">
                {/* Header with Back and Selected Stars */}
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-1 text-[#dfb76c]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className={`w-4 h-4 cursor-pointer transition-colors ${
                          formData.rating >= star
                            ? 'fill-[#dfb76c] text-[#dfb76c]'
                            : 'text-stone-600'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-stone-300 ml-1 font-semibold">
                      ({formData.rating}/5)
                    </span>
                  </div>
                </div>

                {/* Step Subtitle */}
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                    Review Content
                  </h3>
                  <p className="text-xs text-stone-400">
                    Share your detailed impression of {product?.name}.
                  </p>
                </div>

                {/* Review Content (Required) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Review Content * <span className="text-stone-400 font-normal">(Required)</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What did you love about the scent? How was the longevity, projection, and occasion wear?..."
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-[#dfb76c] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Review Headline / Title (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Review Title / Headline <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A true French masterpiece, lasts 12+ hours!"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-3 flex items-center justify-between border-t border-[#241e17]">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!formData.comment.trim()}
                    onClick={() => setModalStep(3)}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                      formData.comment.trim()
                        ? 'bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a]'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Reviewer Information (Name & Email Required) */}
            {modalStep === 3 && (
              <form
                onSubmit={handleSubmitReview}
                className="space-y-4 animate-in fade-in duration-200 text-left"
              >
                {/* Header with Back */}
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <button
                    type="button"
                    onClick={() => setModalStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <span className="text-[11px] font-semibold text-[#dfb76c] uppercase tracking-wider">
                    Almost Done
                  </span>
                </div>

                {/* Subtitle */}
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                    Your Information
                  </h3>
                  <p className="text-xs text-stone-400">
                    Enter your details to publish your verified customer review.
                  </p>
                </div>

                {/* Full Name (Required) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Your Name * <span className="text-stone-400 font-normal">(Required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daniyal Tariq"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                  />
                </div>

                {/* Email Address (Required) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    Email Address * <span className="text-stone-400 font-normal">(Required)</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. daniyal@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Your email will not be displayed publicly on the store.
                  </p>
                </div>

                {/* City in Pakistan (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                    City in Pakistan <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi, Islamabad, Peshawar..."
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-3 flex items-center justify-between border-t border-[#241e17]">
                  <button
                    type="button"
                    onClick={() => setModalStep(2)}
                    className="text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim() || !formData.email.trim()}
                    className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                      formData.name.trim() && formData.email.trim()
                        ? 'bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a]'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Review Done */}
            {modalStep === 4 && (
              <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Thank You for Your Review!
                  </h3>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto mt-2 leading-relaxed">
                    Your feedback for <strong className="text-white">{product?.name}</strong> has been successfully submitted and will appear in our customer reviews.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-8 py-2.5 rounded-xl bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
