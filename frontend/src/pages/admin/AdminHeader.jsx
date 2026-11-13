import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  RefreshCw,
  ChevronDown,
  Sparkles,
  LayoutTemplate,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function AdminHeader({
  activeTab,
  setActiveTab,
  setSidebarOpen,
  loadAllRealData,
  isRefreshing,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Overview';
      case 'products':
        return 'Fragrance Inventory & Catalog';
      case 'orders':
        return 'Customer Orders & Shipments';
      case 'messages':
        return 'Inquiries & Customer Care';
      case 'newsletter':
        return 'VIP Newsletter Subscribers';
      case 'reviews':
        return 'Customer Reviews & Moderation';
      case 'hero':
        return 'Home Hero Banner & Imagery';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
            {getTabTitle()}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block">
            Milestone Fragrance official administrative dashboard.
          </p>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={loadAllRealData}
          disabled={isRefreshing}
          title="Refresh Real Data"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#b38531]' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        {/* Frontend Setup Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer select-none ${activeTab === 'hero' || isDropdownOpen
                ? 'bg-[#b38531] text-white shadow-md ring-2 ring-[#b38531]/25'
                : 'bg-[#b38531] hover:bg-[#966d21] text-white hover:shadow-md'
              }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Frontend Setup</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Dropdown Popover */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Frontend Pages & Sections
              </div>

              <div className="p-1.5 space-y-1">
                {/* Home Hero Banner Item */}
                <Link
                  to="/admin/frontend-setup/hero"
                  onClick={() => {
                    if (setActiveTab) setActiveTab('hero');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer select-none ${activeTab === 'hero'
                      ? 'bg-amber-50/90 text-[#966d21] font-semibold border border-amber-200/80 shadow-2xs'
                      : 'hover:bg-stone-50 text-stone-700'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'hero'
                          ? 'bg-[#b38531] text-white shadow-2xs'
                          : 'bg-amber-50 text-[#b38531]'
                        }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Home Hero Banner</div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        Slides, background & headlines
                      </div>
                    </div>
                  </div>

                  {activeTab === 'hero' ? (
                    <Check className="w-4 h-4 text-[#b38531] shrink-0" />
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                      Live
                    </span>
                  )}
                </Link>
              </div>

              {/* View Live Storefront Quick Link */}
              <div className="pt-1.5 mt-1 border-t border-stone-100 px-1.5">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-[11px]">
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    <span>View Live Storefront</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Opens tab</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
