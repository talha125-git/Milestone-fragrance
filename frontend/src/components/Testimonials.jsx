import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../data/products';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="w-full bg-[#0d0c0a] py-16 sm:py-24 border-b border-[#201b16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle */}
        <p className="text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2">
          TESTIMONIALS
        </p>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal mb-10 sm:mb-14">
          What Our Customers Say
        </h2>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left mb-8">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-[#12100d] border rounded-xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                activeIndex === idx
                  ? 'border-[#dfb76c] shadow-lg shadow-black/60 bg-[#161310]'
                  : 'border-[#262018] hover:border-stone-700'
              }`}
            >
              {/* Header: Avatar + Stars + Author */}
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#dfb76c]/40"
                  />
                  <div>
                    {/* 5 Stars */}
                    <div className="flex text-[#dfb76c] mb-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#dfb76c] text-[#dfb76c]"
                        />
                      ))}
                    </div>
                    {/* Name & Location */}
                    <div className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                      {item.name}
                    </div>
                    <div className="text-stone-400 text-[11px] font-light">
                      {item.city}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-stone-300 text-xs sm:text-[13px] font-light leading-relaxed italic">
                  {item.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation (< dots >) */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous Testimonial"
            className="w-8 h-8 rounded-full border border-stone-800 hover:border-[#dfb76c] text-stone-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`transition-all rounded-full focus:outline-none ${
                  activeIndex === idx
                    ? 'w-5 h-1.5 bg-[#dfb76c]'
                    : 'w-1.5 h-1.5 bg-stone-700 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next Testimonial"
            className="w-8 h-8 rounded-full border border-stone-800 hover:border-[#dfb76c] text-stone-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

