import React from 'react';
import { ArrowRight } from 'lucide-react';
import manImg from '../assets/man.png';
import womanImg from '../assets/woman.png';
import unisexImg from '../assets/unisex.png';

export default function GenderBar({ onSelectGender }) {
  const categories = [
    {
      id: 'men',
      title: 'For Him',
      subtitle: 'Bold & Classic',
      image: manImg,
      alt: 'Luxury Fragrance For Him - Bold and Classic',
    },
    {
      id: 'women',
      title: 'For Her',
      subtitle: 'Elegant & Floral',
      image: womanImg,
      alt: 'Luxury Fragrance For Her - Elegant and Floral',
    },
    {
      id: 'unisex',
      title: 'Unisex',
      subtitle: 'For Everyone',
      image: unisexImg,
      alt: 'Luxury Unisex Fragrance - For Everyone',
    },
  ];

  return (
    <section className="w-full bg-[#0d0b09] border-y border-[#221d17] relative select-none">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {categories.map((cat, idx) => (
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
              className="group relative flex items-center justify-between overflow-hidden bg-[#0d0b09] cursor-pointer min-h-[260px] sm:min-h-[290px] md:min-h-[320px] lg:min-h-[360px] xl:min-h-[390px]"
            >
              {/* Subtle vertical golden divider between columns on desktop */}
              {idx > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-36 w-[1px] bg-gradient-to-b from-transparent via-[#dfb76c]/30 to-transparent pointer-events-none z-20" />
              )}

              {/* Horizontal divider for mobile only */}
              {idx > 0 && (
                <div className="md:hidden absolute top-0 left-6 right-6 h-[1px] bg-[#221d17] pointer-events-none" />
              )}

              {/* Right: Full-height Model Photo with smooth zoom transition on card hover */}
              <div className="absolute right-0 bottom-0 top-3 sm:top-4 md:top-5 w-[60%] sm:w-[56%] md:w-[62%] lg:w-[58%] xl:w-[55%] overflow-hidden pointer-events-none flex items-end justify-end">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="h-full w-auto max-w-full object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
                  loading="lazy"
                />
              </div>

              {/* Left: Luxury Typography, Gold Accent Underline, and Button */}
              <div className="relative z-10 pl-6 sm:pl-8 lg:pl-10 xl:pl-14 py-6 max-w-[52%] sm:max-w-[48%] flex flex-col items-start justify-center">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[34px] font-sans font-bold text-white tracking-tight leading-none">
                  {cat.title}
                </h3>

                {/* Gold Underline Accent */}
                <div className="w-8 sm:w-10 h-[2px] bg-[#dfb76c] my-2.5 sm:my-3 transition-all duration-300 group-hover:w-14 group-hover:bg-[#f0c87d]" />

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-[#c8ad7f] font-normal tracking-wide mb-4 sm:mb-5 line-clamp-1">
                  {cat.subtitle}
                </p>

                {/* SHOP NOW Button with gold outline */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#dfb76c]/70 text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-[#dfb76c] group-hover:text-[#0d0b09] group-hover:border-[#dfb76c] shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
