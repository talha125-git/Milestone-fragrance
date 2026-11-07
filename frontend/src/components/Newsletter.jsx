import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { leafLeft, leafRight } from '../assets';
import { subscribeNewsletter } from '../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      await subscribeNewsletter(email.trim());
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 4000);
    }
  };

  return (
    <section className="relative w-full bg-[#0d0c0a] py-16 sm:py-24 border-b border-[#201b16] overflow-hidden">
      {/* Subtle Central Warm Ambient Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[580px] h-[280px] sm:h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.12)_0%,rgba(180,120,40,0.05)_45%,transparent_75%)] blur-3xl pointer-events-none" />

      {/* Decorative Golden Leaves in corners - Responsively Scaled & Non-Obtrusive */}
      <img
        src={leafLeft}
        alt="Ornamental gold leaf"
        className="absolute left-0 bottom-0 max-h-28 sm:max-h-40 lg:max-h-52 w-auto object-contain opacity-40 sm:opacity-65 lg:opacity-85 pointer-events-none select-none"
      />
      <img
        src={leafRight}
        alt="Ornamental gold leaf"
        className="absolute right-0 bottom-0 max-h-28 sm:max-h-40 lg:max-h-52 w-auto object-contain opacity-40 sm:opacity-65 lg:opacity-85 pointer-events-none select-none"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Typography */}
        <p className="text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2">
          STAY UPDATED
        </p>

        <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-serif text-white font-normal mb-3">
          Join Our Newsletter
        </h2>

        <p className="text-stone-400 text-xs sm:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
          Get exclusive offers, new arrivals and fragrance tips.
        </p>

        {/* Form or Success State */}
        <div className="max-w-md sm:max-w-lg mx-auto">
          {submitted ? (
            <div className="bg-[#14120f] border border-[#dfb76c]/40 text-[#dfb76c] px-5 py-3.5 rounded-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium shadow-md">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Thank you for subscribing! Your welcome discount code is sent.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#dfb76c]/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full bg-[#14120f] border border-[#2a241b] focus:border-[#dfb76c] text-stone-200 placeholder-stone-500 text-xs sm:text-sm rounded-lg pl-11 pr-4 py-3 sm:py-3.5 focus:outline-none focus:ring-1 focus:ring-[#dfb76c]/50 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.98] text-[#0d0c0a] font-semibold text-xs sm:text-sm px-7 py-3 sm:py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

