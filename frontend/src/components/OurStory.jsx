import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import { ourStory } from '../assets';

export default function OurStory({ onLearnMore }) {
  return (
    <section className="relative w-full bg-[#FAF6F0] py-16 sm:py-24 border-b border-[#e5ded2] overflow-hidden">
      {/* Soft warm ambient lighting for background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(223,183,108,0.15)_0%,rgba(200,140,50,0.06)_45%,transparent_75%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Image Lineup Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1">
            <div className="relative group w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[580px]">
              {/* Outer Golden Ambient Glow */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.28)_0%,rgba(200,140,50,0.1)_45%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-80" />

              {/* Luxury Frame Container */}
              <div className="relative bg-white/85 backdrop-blur-xs border border-stone-200/90 hover:border-[#dfb76c]/70 rounded-2xl p-3 sm:p-5 shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(223,183,108,0.18)] transition-all duration-500 overflow-hidden">
                {/* Floating Top-Left Luxury Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 inline-flex items-center gap-1.5 bg-[#0d0c0a]/90 backdrop-blur-md text-[#dfb76c] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#dfb76c]/30 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                  <span>The Signature Lineup</span>
                </div>

                {/* Floating Bottom-Right Quality Pill */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-stone-800 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-stone-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dfb76c]" />
                  <span>Extrait De Parfum</span>
                </div>

                {/* Main Product Lineup Image */}
                <div className="relative overflow-hidden rounded-xl pt-7 pb-6 sm:pt-9 sm:pb-7 flex items-center justify-center">
                  <img
                    src={ourStory}
                    alt="Milestone Fragrances Trio - Believe, Signature, Ghanam, Professor"
                    className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>

              {/* Floor Shadow Reflection */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-4 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08)_0%,transparent_75%)] blur-xs pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 text-left space-y-4 sm:space-y-6 order-1 lg:order-2">
            <p className="text-stone-700 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase">
              OUR STORY
            </p>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-serif text-stone-900 font-normal leading-[1.2]">
              More Than Just a Fragrance
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
              At Milestone Fragrances, we believe a scent is more than just a perfume — it's a memory, an emotion and a reflection of your personality. We create premium, long-lasting fragrances for every occasion and mood.
            </p>

            {/* 3 Luxury Story Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-200/90 max-w-lg">
              <div>
                <div className="font-serif text-base sm:text-xl font-bold text-stone-900">25%+</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide uppercase mt-0.5">
                  High Oil
                </div>
              </div>
              <div>
                <div className="font-serif text-base sm:text-xl font-bold text-stone-900">12+ Hrs</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide uppercase mt-0.5">
                  Longevity
                </div>
              </div>
              <div>
                <div className="font-serif text-base sm:text-xl font-bold text-stone-900">100%</div>
                <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide uppercase mt-0.5">
                  Handcrafted
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLearnMore}
                className="group inline-flex items-center gap-2 bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-semibold text-xs sm:text-sm px-6 py-2.5 sm:px-7 sm:py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

