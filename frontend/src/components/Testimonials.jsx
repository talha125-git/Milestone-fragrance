import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { loadStoredReviews } from '../data/reviews';
import { avatarAhmed, avatarAyesha, avatarUsman } from '../assets';

export default function Testimonials() {
  const [reviewsList, setReviewsList] = useState(() => loadStoredReviews());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync with newly submitted reviews in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setReviewsList(loadStoredReviews());
    };
    window.addEventListener('milestone_reviews_updated', handleUpdate);
    return () => window.removeEventListener('milestone_reviews_updated', handleUpdate);
  }, []);

  // If there are no reviews yet, hide the section completely
  if (!reviewsList || reviewsList.length === 0) {
    return null;
  }

  // Items per view: 3 on desktop, 1 on mobile
  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviewsList.length / itemsPerPage);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const visibleReviews = reviewsList.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  // Fallback to fill up to 3 if last page has fewer items
  const displayItems = visibleReviews.length < itemsPerPage && reviewsList.length >= itemsPerPage
    ? [...visibleReviews, ...reviewsList.slice(0, itemsPerPage - visibleReviews.length)]
    : visibleReviews;

  // Preset avatars mapping
  const avatarMap = {
    'Ahmed Raza': avatarAhmed,
    'Ayesha Khan': avatarAyesha,
    'Usman Sheikh': avatarUsman,
  };

  return (
    <section id="homepage-reviews" className="w-full bg-[#0d0c0a] py-16 sm:py-24 border-b border-[#201b16] text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle */}
        <div className="inline-flex items-center gap-1.5 text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CUSTOMER REVIEWS & EXPERIENCES</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal mb-3">
          What Our Connoisseurs Say
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto mb-10 sm:mb-12">
          Authentic feedback from verified customers wearing Milestone Extrait de Parfum across Pakistan.
        </p>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left mb-8">
          {displayItems.map((item, idx) => {
            const initials = item.name
              ? item.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'VIP';

            const matchedAvatar = avatarMap[item.name];

            return (
              <div
                key={`${item.id}-${idx}`}
                className="bg-[#12100d] border border-[#262018] hover:border-[#dfb76c]/60 rounded-xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/60 group"
              >
                <div>
                  {/* Header: Avatar + Stars + Verified Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {matchedAvatar ? (
                        <img
                          src={matchedAvatar}
                          alt={item.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#dfb76c]/40 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#1c1813] border border-[#dfb76c]/40 text-[#dfb76c] font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-inner">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.verified !== false && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <div className="text-stone-400 text-[11px] font-light">
                          {item.city || 'Pakistan'}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex text-[#dfb76c]">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#dfb76c] text-[#dfb76c]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Reviewed Product Pill */}
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#dfb76c] bg-[#dfb76c]/10 border border-[#dfb76c]/20 px-2 py-0.5 rounded">
                      Reviewed: {item.productName || 'Signature art. 023'}
                    </span>
                    {item.performance && (
                      <span className="text-[10px] text-stone-400 bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded">
                        {item.performance}
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  {item.title && (
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-200 mb-1 line-clamp-1">
                      {item.title}
                    </h4>
                  )}

                  {/* Quote / Comment */}
                  <p className="text-stone-300 text-xs sm:text-[13px] font-light leading-relaxed italic line-clamp-4">
                    "{item.comment || item.quote}"
                  </p>
                </div>

                {/* Footer date */}
                <div className="pt-3 mt-3 border-t border-[#1c1813] text-[10px] text-stone-500 flex items-center justify-between">
                  <span>{item.date || 'Recent Verified Order'}</span>
                  <span className="text-emerald-500/80 font-semibold">100% Extrait Buyer</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation (< dots >) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous Testimonials"
              className="w-9 h-9 rounded-full border border-stone-800 hover:border-[#dfb76c] text-stone-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to page ${idx + 1}`}
                  className={`transition-all rounded-full focus:outline-none cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 h-1.5 bg-[#dfb76c]'
                      : 'w-2 h-1.5 bg-stone-700 hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next Testimonials"
              className="w-9 h-9 rounded-full border border-stone-800 hover:border-[#dfb76c] text-stone-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View All Reviews Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-[#dfb76c] bg-[#14120f] hover:bg-[#dfb76c] text-[#dfb76c] hover:text-[#0d0c0a] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#dfb76c]/20 cursor-pointer group"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
