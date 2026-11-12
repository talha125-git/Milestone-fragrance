import React from 'react';
import { ArrowRight } from 'lucide-react';
import { featuredProfessor } from '../assets';

export default function FeaturedFragrance({ onShopProfessor }) {
  return (
    <section className="relative w-full bg-[#0d0c0a] py-16 sm:py-24 border-b border-[#201b16] overflow-hidden">
      {/* Ambient background studio lighting - Responsive wide atmospheric glow */}
      <div className="absolute top-1/2 right-0 sm:right-[5%] lg:right-[8%] -translate-y-1/2 w-[340px] sm:w-[520px] lg:w-[680px] h-[340px] sm:h-[520px] lg:h-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(223,183,108,0.25)_0%,rgba(180,120,40,0.12)_45%,rgba(13,12,10,0)_75%)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] lg:right-[15%] w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-[radial-gradient(circle,rgba(245,213,143,0.18)_0%,rgba(223,183,108,0.08)_50%,transparent_75%)] blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 text-left space-y-4 sm:space-y-5 z-10">
            <p className="text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase">
              FEATURED FRAGRANCE
            </p>

            <h2 className="text-4xl sm:text-6xl font-serif italic text-[#dfb76c] font-normal tracking-wide">
              Professor
            </h2>

            <h3 className="text-lg sm:text-2xl font-serif text-white font-normal">
              A scent that defines character.
            </h3>

            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
              A bold and sophisticated fragrance. Professor blends rich woody notes with a touch of amber for a confident and lasting impression.
            </p>

            <div className="text-white font-bold text-lg sm:text-xl text-[#dfb76c] pt-1">
              Rs. 6,499
            </div>

            <div className="pt-2">
              <button
                onClick={onShopProfessor}
                className="group inline-flex items-center gap-2 bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-semibold text-xs sm:text-sm px-6 py-2.5 sm:px-7 sm:py-3 rounded-md transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Image with Rich Studio Lighting */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative group max-w-[340px] sm:max-w-[440px] lg:max-w-[490px] w-full py-4 sm:py-6">
              {/* Outer Golden Aura (Blooms beyond image bounds) */}
              <div className="absolute -inset-4 sm:-inset-8 lg:-inset-12 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.38)_0%,rgba(200,135,40,0.18)_42%,transparent_72%)] blur-2xl sm:blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 opacity-90" />

              {/* Intense Bottle Backlight (Directly behind the golden glass bottle on the right) */}
              <div className="absolute top-[20%] right-[3%] sm:right-[8%] w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-[radial-gradient(circle,rgba(255,220,140,0.55)_0%,rgba(223,183,108,0.32)_45%,transparent_75%)] blur-xl sm:blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-110" />

              {/* Box Silhouette Rim Light (Soft warm glow outlining the black Professor box on the left) */}
              <div className="absolute top-[16%] left-[6%] sm:left-[10%] w-48 sm:w-60 h-60 sm:h-76 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.24)_0%,rgba(180,110,30,0.1)_50%,transparent_75%)] blur-2xl pointer-events-none" />

              {/* Subtle Luxury Concentric Ring Accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full border border-[#dfb76c]/15 blur-[0.5px] pointer-events-none" />

              {/* Pedestal Reflection / Grounding Light (Floor spotlight beneath the bottle and box) */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-[85%] sm:w-[90%] h-10 sm:h-14 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.45)_0%,rgba(180,120,40,0.18)_40%,transparent_75%)] blur-md pointer-events-none" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] sm:w-[75%] h-4 sm:h-5 rounded-[100%] bg-black/80 blur-xs pointer-events-none" />

              {/* Professor Product Image */}
              <img
                src={featuredProfessor}
                alt="Milestone Professor Fragrance"
                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(223,183,108,0.22)] transition-all duration-500 group-hover:scale-[1.025] group-hover:drop-shadow-[0_0_30px_rgba(223,183,108,0.38)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

