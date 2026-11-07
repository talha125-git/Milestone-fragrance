import React from 'react';

export default function GenderBar({ onSelectGender }) {
  const categories = [
    {
      id: 'men',
      title: 'Men',
      subtitle: 'Bold & Classic',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#dfb76c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {/* Male Mars Symbol */}
          <circle cx="10" cy="14" r="5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5L19 5m0 0h-4m4 0v4" />
        </svg>
      ),
    },
    {
      id: 'women',
      title: 'Women',
      subtitle: 'Elegant & Floral',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#dfb76c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {/* Female Venus Symbol */}
          <circle cx="12" cy="9" r="5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m-3-3h6" />
        </svg>
      ),
    },
    {
      id: 'unisex',
      title: 'Unisex',
      subtitle: 'For Everyone',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#dfb76c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {/* Unisex Interlocking Rings */}
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#0a0908] border-b border-[#201b16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-3 divide-x divide-[#241e17]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectGender(cat.id)}
              className="group flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-2 sm:px-6 py-1 text-center sm:text-left transition-all hover:bg-white/[0.02] cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#181410] border border-[#30271c] group-hover:border-[#dfb76c] flex items-center justify-center transition-colors shadow-inner flex-shrink-0">
                {cat.icon}
              </div>
              <div>
                <div className="text-white text-xs sm:text-base font-semibold tracking-wide group-hover:text-[#dfb76c] transition-colors">
                  {cat.title}
                </div>
                <div className="text-stone-400 text-[10px] sm:text-xs font-light tracking-normal">
                  {cat.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

