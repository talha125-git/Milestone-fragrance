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
      objectPos: 'object-bottom',
    },
    {
      id: 'women',
      title: 'For Her',
      subtitle: 'Elegant & Floral',
      image: womanImg,
      alt: 'Luxury Fragrance For Her - Elegant and Floral',
      objectPos: 'object-bottom',
    },
    {
      id: 'unisex',
      title: 'Unisex',
      subtitle: 'For Everyone',
      image: unisexImg,
      alt: 'Luxury Unisex Fragrance - For Everyone',
      objectPos: 'object-bottom',
    },
  ];

  return (
    <section className="w-full bg-[#0b0a09] border-y border-[#201a14] relative select-none">
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
              className="group relative flex items-center justify-between overflow-hidden bg-[#0b0a09] hover:bg-[#110f0d] transition-colors duration-300 cursor-pointer min-h-[160px] sm:min-h-[175px] md:min-h-[180px] lg:min-h-[210px] xl:min-h-[230px]"
            >
              {/* Subtle vertical golden divider between columns on desktop */}
              {idx > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-28 w-[1px] bg-gradient-to-b from-transparent via-[#dfb76c]/25 to-transparent pointer-events-none z-20" />
              )}

              {/* Horizontal divider for mobile only */}
              {idx > 0 && (
                <div className="md:hidden absolute top-0 left-6 right-6 h-[1px] bg-[#221c16] pointer-events-none" />
              )}

              {/* Warm luxury spotlight glow behind character */}
              <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-48 h-48 bg-[#dfb76c]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#dfb76c]/18 transition-all duration-500" />

              {/* Right: Transparent Cutout Model Photo */}
              <div className="absolute right-0 bottom-0 top-0 w-[55%] sm:w-[50%] md:w-[54%] lg:w-[52%] xl:w-[48%] overflow-hidden pointer-events-none flex items-end justify-end">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className={`w-full h-full object-cover sm:object-contain md:object-cover ${cat.objectPos} transition-transform duration-700 ease-out group-hover:scale-105`}
                  loading="lazy"
                />
                {/* Soft gradient fade on the left edge for seamless text blend */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#0b0a09] via-[#0b0a09]/70 to-transparent pointer-events-none" />
              </div>

              {/* Left: Luxury Typography, Gold Accent Underline, and Button */}
              <div className="relative z-10 pl-6 sm:pl-8 lg:pl-10 xl:pl-14 py-6 max-w-[55%] sm:max-w-[52%] flex flex-col items-start justify-center">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-sans font-bold text-white tracking-tight leading-none group-hover:text-white transition-colors">
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

              {/* Subtle luxury gold rim light on card hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-[#dfb76c]/25 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
