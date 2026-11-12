import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function GenderBar({ onSelectGender }) {
  const categories = [
    {
      id: 'men',
      title: 'For Him',
      subtitle: 'Bold & Classic',
      image: '/gender_man_clean.png',
      alt: 'Luxury Fragrance For Him - Bold and Classic',
    },
    {
      id: 'women',
      title: 'For Her',
      subtitle: 'Elegant & Floral',
      image: '/gender_woman_clean.png',
      alt: 'Luxury Fragrance For Her - Elegant and Floral',
    },
    {
      id: 'unisex',
      title: 'Unisex',
      subtitle: 'For Everyone',
      image: '/gender_couple_clean.png',
      alt: 'Luxury Unisex Fragrance - For Everyone',
    },
  ];

  return (
    <section className="w-full bg-[#0b0a09] border-y border-[#201a14] relative select-none">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2a2218]">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectGender && onSelectGender(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectGender && onSelectGender(cat.id);
                }
              }}
              aria-label={`Shop ${cat.title} - ${cat.subtitle}`}
              className="group relative flex items-center justify-between overflow-hidden bg-[#0b0a09] hover:bg-[#100e0c] transition-colors duration-300 cursor-pointer min-h-[150px] sm:min-h-[165px] md:min-h-[160px] lg:min-h-[180px] xl:min-h-[195px]"
            >
              {/* Right: Character Model Photo */}
              <div className="absolute right-0 top-0 bottom-0 w-[56%] sm:w-[52%] md:w-[54%] lg:w-[50%] overflow-hidden pointer-events-none">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark gradient fade on the left edge for perfect seamless text blend */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#0b0a09] to-transparent pointer-events-none" />
              </div>

              {/* Left: Real HTML Typography, Gold Underline, and Button */}
              <div className="relative z-10 pl-6 sm:pl-8 lg:pl-10 xl:pl-12 py-5 max-w-[56%] sm:max-w-[54%] flex flex-col items-start justify-center">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-[25px] xl:text-[27px] font-sans font-bold text-white tracking-tight leading-none group-hover:text-white transition-colors">
                  {cat.title}
                </h3>

                {/* Gold Underline Accent matching user's design */}
                <div className="w-7 sm:w-8 h-[2px] bg-[#dfb76c] my-2 sm:my-2.5 transition-all duration-300 group-hover:w-12 group-hover:bg-[#f0c87d]" />

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-[#c8ad7f] font-normal tracking-wide mb-3 sm:mb-4 line-clamp-1">
                  {cat.subtitle}
                </p>

                {/* SHOP NOW Button with gold outline */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#dfb76c]/70 text-[#dfb76c] text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#dfb76c] group-hover:text-[#0b0a09] group-hover:border-[#dfb76c] shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Subtle luxury gold rim light on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#dfb76c]/30 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
