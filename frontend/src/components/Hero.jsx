import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ghanamHeroBg, believeHeroBg, heroBg, professorHeroBg } from '../assets';

export default function Hero({ onShopNow }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 'ghanam',
      bgImage: ghanamHeroBg,
      tag: 'GHANAM RANGE • ORIENTAL HERITAGE',
      titleLine1: 'Ghanam Range',
      titleLine2: 'Crafted For Royalty',
      description: 'A rich oriental scent with a modern touch. Blended with exquisite Persian saffron, Damascus rose, and rare royal Cambodian oud.',
      notes: 'Saffron, Amber & Cambodian Oud',
      product: 'Ghanam Royal Reserve',
      price: 'Rs. 6,499',
    },
    {
      id: 'believe',
      bgImage: believeHeroBg,
      tag: 'BELIEVE COLLECTION • FRESH & VIBRANT',
      titleLine1: 'Believe Collection',
      titleLine2: 'Fresh, Vibrant & Pure',
      description: 'Fresh, vibrant and long-lasting. An invigorating splash of Mediterranean citrus and sea salt, harmoniously grounded by aromatic bay leaf and amber.',
      notes: 'Marine Accord, Mandarin & Ambergris',
      product: 'Believe Pour Homme & Femme',
      price: 'Rs. 6,499',
    },
    {
      id: 'signature',
      bgImage: heroBg,
      tag: 'SIGNATURE SERIES • PREMIUM FRAGRANCES',
      titleLine1: 'Timeless Scents',
      titleLine2: 'For Every Moment',
      description: 'Discover the art of fragrance. Crafted for those who leave a lasting impression. A refined balance of warm woods, golden amber, and Italian bergamot.',
      notes: 'Warm Woods & Amber • Cedarwood & Oud',
      product: 'Signature art. 023',
      price: 'Rs. 6,499',
    },
    {
      id: 'professor',
      bgImage: professorHeroBg,
      tag: 'PROFESSOR EDITION • BOLD & SOPHISTICATED',
      titleLine1: 'Professor Edition',
      titleLine2: 'A Scent That Defines Character',
      description: 'Bold, intelligent and sophisticated. Professor blends rich woody notes with black cardamom, smoked leather, and Madagascar amber for a magnetic impression.',
      notes: 'Black Cardamom, Smoked Leather & Amber',
      product: 'Professor Edition',
      price: 'Rs. 6,499',
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-[#0d0b09] overflow-hidden border-b border-[#221d17] min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center select-none"
    >
      {/* 
        Synchronized Slides:
        Both the background image and its corresponding text are mounted per slide,
        and fade in/out at the EXACT same time with duration-700 ease-in-out.
      */}
      {slides.map((slide, idx) => {
        const isActive = activeSlide === idx;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              isActive
                ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                : 'opacity-0 scale-[1.02] z-0 pointer-events-none'
            }`}
          >
            {/* Background Image for this slide */}
            <div
              className="absolute inset-0 bg-cover bg-no-repeat bg-[position:72%_center] sm:bg-[position:78%_center] md:bg-[position:right_center] lg:bg-center"
              style={{
                backgroundImage: `url(${slide.bgImage})`,
              }}
            />

            {/* Dark gradient overlay on the left so text is crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09] via-[#0d0b09]/90 sm:via-[#0d0b09]/75 md:via-[#0d0b09]/55 to-transparent pointer-events-none" />

            {/* Left Column Text Content - Synchronized with the background */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-38 lg:pb-24">
              <div
                className={`max-w-xl text-left space-y-4 sm:space-y-6 transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-6'
                }`}
              >
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#dfb76c]/40 text-[#dfb76c] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                  <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                  <span>{slide.tag}</span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-normal text-white leading-[1.12] tracking-tight drop-shadow-lg">
                  <div>{slide.titleLine1}</div>
                  <div className="text-[#dfb76c] italic font-serif font-normal">
                    {slide.titleLine2}
                  </div>
                </h1>

                {/* Paragraph Description */}
                <p className="text-stone-300 text-xs sm:text-base font-light leading-relaxed max-w-md drop-shadow-md">
                  {slide.description}
                </p>

                {/* Key Fragrance Notes Pill & Price */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="text-xs text-[#dfb76c] bg-black/50 backdrop-blur-xs px-3 py-1 rounded border border-[#dfb76c]/30 font-medium">
                    Notes: <span className="text-stone-200">{slide.notes}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white bg-black/50 backdrop-blur-xs px-3 py-1 rounded border border-white/10">
                    {slide.price}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onShopNow(slide.id)}
                    className="group inline-flex items-center gap-2 bg-[#dfb76c] hover:bg-[#cda153] text-[#0d0c0a] font-semibold text-xs sm:text-sm px-6 py-2.5 sm:px-7 sm:py-3 rounded-md transition-all duration-200 shadow-xl hover:shadow-[#dfb76c]/30 hover:scale-[1.02] focus:outline-none cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Global Top & Bottom Vignettes for seamless header/footer integration */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0d0b09]/80 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d0b09]/90 to-transparent pointer-events-none z-20" />

      {/* Left Navigation Chevron Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-stone-200 hover:text-white hover:border-[#dfb76c] hover:bg-black/90 flex items-center justify-center transition-all focus:outline-none cursor-pointer shadow-2xl active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Right Navigation Chevron Button */}
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-stone-200 hover:text-white hover:border-[#dfb76c] hover:bg-black/90 flex items-center justify-center transition-all focus:outline-none cursor-pointer shadow-2xl active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Global Carousel Dots Navigation */}
      <div className="absolute bottom-6 left-6 sm:left-12 lg:left-16 z-30 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-500 rounded-full focus:outline-none cursor-pointer ${
              activeSlide === idx
                ? 'w-8 h-2 bg-[#dfb76c] shadow-md shadow-[#dfb76c]/60'
                : 'w-2 h-2 bg-stone-500/70 hover:bg-stone-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
