import React from 'react';
import { ArrowRight } from 'lucide-react';
import { fragranceTypes } from '../data/products';

export default function FragranceTypes({ onSelectType }) {
  return (
    <section className="w-full bg-[#0d0c0a] py-14 sm:py-20 border-b border-[#201b16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle Tag */}
        <p className="text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2">
          EXPLORE BY FRAGRANCE TYPE
        </p>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal mb-3">
          Find Your Signature Scent
        </h2>

        {/* Description */}
        <p className="text-stone-400 text-xs sm:text-sm font-light max-w-2xl mx-auto mb-10 sm:mb-12">
          From fresh and citrusy to deep and woody — discover the fragrance that defines you.
        </p>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {fragranceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className="group flex flex-col bg-[#14120f] border border-[#262018] rounded-xl overflow-hidden hover:border-[#dfb76c] transition-all duration-300 hover:shadow-lg hover:shadow-black/50 text-left cursor-pointer focus:outline-none"
            >
              {/* Photo Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>

              {/* Title & Arrow */}
              <div className="p-3 sm:p-3.5 flex items-center justify-between bg-[#12100d] group-hover:bg-[#181410] transition-colors">
                <span className="text-white text-xs sm:text-sm font-medium tracking-wide group-hover:text-[#dfb76c] transition-colors">
                  {type.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#dfb76c] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

