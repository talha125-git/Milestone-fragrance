import React from 'react';
import { Sparkles, HeartHandshake, Award } from 'lucide-react';
import { ourStory } from '../assets';

export default function About({ onNavigate }) {
  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase">
              ABOUT MILESTONE FRAGRANCES
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
              More Than Just a Fragrance. <br />
              <span className="italic text-[#dfb76c]">A Living Memory.</span>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              Founded with an uncompromising passion for haute perfumery, Milestone Fragrances was born from a singular vision: to create world-class, long-lasting fragrances that rival historic European perfume houses, tailored for the modern connoisseur.
            </p>
            <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
              We believe a scent is your invisible signature. It lingers after you depart, revives nostalgic memories, and announces your aura without uttering a single word.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('collections')}
                className="bg-[#dfb76c] hover:bg-[#c99f52] text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-md transition-colors"
              >
                Explore The Collection
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[580px]">
              {/* Golden Ambient Glow */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.22)_0%,rgba(180,120,40,0.08)_45%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-75" />

              <div className="relative rounded-2xl overflow-hidden border border-[#2b241c] hover:border-[#dfb76c]/60 shadow-2xl transition-all duration-500 bg-[#12100d]/60 backdrop-blur-xs p-2 sm:p-4">
                <img
                  src={ourStory}
                  alt="Milestone Fragrances Trio"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02] filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="pt-12 border-t border-stone-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2 block">
              OUR PROMISE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-white font-normal">
              The Milestone Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#14120f] border border-[#262018] space-y-3 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-white font-semibold">25%+ Extrait Concentration</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                We formulate each batch with premium perfume oils, delivering 12+ hours of enduring longevity and an irresistible sillage trail.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14120f] border border-[#262018] space-y-3 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-white font-semibold">Rare & Ethically Sourced</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                From Grasse roses and Sicilian bergamot to authentic Cambodian agarwood, we source directly from historic distilleries across the globe.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14120f] border border-[#262018] space-y-3 text-left">
              <div className="w-12 h-12 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-white font-semibold">Customer Perfection</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Backed by thousands of five-star reviews across Pakistan, with fast tracked delivery and a 100% satisfaction guarantee on every bottle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
