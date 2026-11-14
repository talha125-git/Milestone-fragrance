import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Globe,
  Quote,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
} from 'lucide-react';
import {
  loadStoredAbout,
  fetchAboutFromServer,
  ABOUT_UPDATED_EVENT,
} from '../data/about';
import { ourStory, founderYaseenAhmad } from '../assets';

export default function About({ onNavigate }) {
  const [aboutData, setAboutData] = useState(loadStoredAbout);

  useEffect(() => {
    fetchAboutFromServer().then((latest) => {
      if (latest) setAboutData(latest);
    });

    const handleAboutUpdate = (e) => {
      if (e.detail) {
        setAboutData(e.detail);
      } else {
        setAboutData(loadStoredAbout());
      }
    };

    window.addEventListener(ABOUT_UPDATED_EVENT, handleAboutUpdate);
    window.addEventListener('storage', handleAboutUpdate);

    return () => {
      window.removeEventListener(ABOUT_UPDATED_EVENT, handleAboutUpdate);
      window.removeEventListener('storage', handleAboutUpdate);
    };
  }, []);

  const { section1, section2 } = aboutData;

  // Image helpers with reliable fallbacks
  const section1Image = section1?.image || ourStory;
  const section2Image = section2?.image || founderYaseenAhmad;

  const handleCollectionClick = () => {
    if (onNavigate) {
      onNavigate('/collections');
    }
  };

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-12 sm:py-20 font-sans selection:bg-[#dfb76c] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">

        {/* ========================================================
            SECTION 1: THE ART OF FRAGRANCE, THE SPIRIT OF MILESTONE
           ======================================================== */}
        <section className="space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase block">
                {section1?.eyebrow || 'THE ART OF FRAGRANCE, THE SPIRIT OF MILESTONE'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
                {section1?.title || 'A New Chapter in Our Journey'}
              </h1>

              <div className="space-y-4 text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                {(section1?.paragraphs || []).map((para, idx) => (
                  <p key={idx} className="text-stone-300">
                    {para}
                  </p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleCollectionClick}
                  className="bg-[#dfb76c] hover:bg-[#c99f52] text-[#0d0c0a] font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-[#dfb76c]/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore The Fragrances</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Showcase Image 1 (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-[480px]">
                {/* Golden Ambient Glow */}
                <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.22)_0%,rgba(180,120,40,0.08)_45%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-80" />

                <div className="relative rounded-2xl overflow-hidden border border-[#2b241c] hover:border-[#dfb76c]/60 shadow-2xl transition-all duration-500 bg-[#12100d] p-3 sm:p-5 flex items-center justify-center">
                  <img
                    src={section1Image}
                    alt={section1?.imageAlt || 'Milestone Fragrances Art of Perfumery'}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-left flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#dfb76c] font-bold block">
                        Milestone Fragrance
                      </span>
                      <span className="text-xs text-white font-medium">
                        Extrait De Parfum Collection
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Value Pillars (Vision, Commitment, More Than A Fragrance) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Card 1: Our Vision */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#14120f] border border-[#262018] hover:border-[#dfb76c]/40 transition-all duration-300 space-y-3.5 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-semibold tracking-wide">
                {section1?.vision?.title || 'OUR VISION'}
              </h3>
              <p className="text-stone-400 text-xs sm:text-[13px] leading-relaxed font-light">
                {section1?.vision?.text}
              </p>
            </div>

            {/* Card 2: Our Commitment */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#14120f] border border-[#262018] hover:border-[#dfb76c]/40 transition-all duration-300 space-y-3.5 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-semibold tracking-wide">
                {section1?.commitment?.title || 'OUR COMMITMENT'}
              </h3>
              <p className="text-stone-400 text-xs sm:text-[13px] leading-relaxed font-light">
                {section1?.commitment?.text}
              </p>
            </div>

            {/* Card 3: More Than A Fragrance */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#14120f] border border-[#262018] hover:border-[#dfb76c]/40 transition-all duration-300 space-y-3.5 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif text-white font-semibold tracking-wide">
                {section1?.moreThanFragrance?.title || 'MORE THAN A FRAGRANCE'}
              </h3>
              <p className="text-stone-400 text-xs sm:text-[13px] leading-relaxed font-light">
                {section1?.moreThanFragrance?.text}
              </p>
            </div>
          </div>

          {/* Section 1 Brand Tagline Ribbon */}
          <div className="rounded-2xl bg-radial from-[#1e1913] to-[#12100d] border border-[#30261b] p-6 sm:p-8 text-center space-y-2">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-[#dfb76c] block">
              {section1?.taglineBrand || 'MILESTONE FRAGRANCE'}
            </span>
            <p className="text-xl sm:text-2xl font-serif italic text-white">
              "{section1?.taglineSlogan || 'Wear Your Identity. Leave Your Impression.'}"
            </p>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: YASEEN AHMAD — CEO & FOUNDER
           ======================================================== */}
        <section className="pt-12 sm:pt-16 border-t border-[#221c16] space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Showcase Image 2: Founder Portrait (5 Cols) */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="relative group w-full max-w-[460px]">
                {/* Ambient Golden Glow */}
                <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.25)_0%,rgba(160,105,30,0.08)_45%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-80" />

                <div className="relative rounded-2xl overflow-hidden border border-[#2b241c] hover:border-[#dfb76c]/60 shadow-2xl transition-all duration-500 bg-[#14120f] p-3 sm:p-4">
                  <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#0a0908]">
                    <img
                      src={section2Image}
                      alt={section2?.founderName || 'Yaseen Ahmad, CEO & Founder'}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#dfb76c] text-[#0d0c0a] text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-md">
                        {section2?.founderRole || 'CEO & FOUNDER'}
                      </div>
                      <h4 className="text-white text-lg sm:text-xl font-serif font-bold leading-tight">
                        {section2?.founderName || 'Yaseen Ahmad'}
                      </h4>
                      <p className="text-xs text-stone-300 font-light">
                        {section2?.company || 'Milestone Group of Companies'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Founder Vision & Words (7 Cols) */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
              <div>
                <span className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
                  {section2?.eyebrow || 'LEADERSHIP & VISION'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
                  {section2?.founderName || 'YASEEN AHMAD'}
                </h2>
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-stone-400 uppercase">
                  {section2?.founderRole || 'CEO & FOUNDER'}
                </span>
              </div>

              <div className="space-y-4 text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                {(section2?.paragraphs || []).map((para, idx) => (
                  <p key={idx} className="text-stone-300">
                    {para}
                  </p>
                ))}
              </div>

              {/* Founder Signature Quote Callout */}
              {section2?.quote && (
                <div className="relative p-6 sm:p-7 rounded-2xl bg-[#161310] border-l-4 border-[#dfb76c] border-t border-r border-b border-[#2b241c] space-y-2">
                  <Quote className="w-6 h-6 text-[#dfb76c] opacity-60" />
                  <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed">
                    "{section2.quote}"
                  </p>
                  <span className="text-[11px] text-[#dfb76c] font-semibold tracking-wider uppercase block pt-1">
                    — {section2.founderName || 'Yaseen Ahmad'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
