import React, { useState } from 'react';
import { X, Search, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';

export default function SearchModal({
  isOpen,
  onClose,
  onOpenQuickView,
  onAddToCart,
}) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.topNotes.some((n) => n.toLowerCase().includes(q)) ||
          p.heartNotes.some((n) => n.toLowerCase().includes(q)) ||
          p.baseNotes.some((n) => n.toLowerCase().includes(q))
        );
      })
    : products;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-[#14120f] border border-[#262018] rounded-xl shadow-2xl p-5 sm:p-6 text-stone-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-[#dfb76c]" />
              <input
                type="text"
                autoFocus
                placeholder="Search perfumes by name, notes, or category (e.g. Amber, Citrus, Woody)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-stone-500 focus:outline-none"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results list */}
          <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
            <p className="text-[11px] uppercase tracking-wider text-stone-400">
              {query.trim() ? `Results (${filtered.length})` : 'Popular Fragrances'}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-10 text-stone-500 text-sm">
                No fragrances found matching "{query}".
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#181512] hover:bg-[#1f1a15] border border-stone-800/80 transition-colors cursor-pointer group"
                  onClick={() => {
                    onOpenQuickView(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 bg-[#FAF6F0] rounded p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-[#dfb76c] transition-colors font-serif">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-400">{item.tagline}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        <span>{item.gender}</span>
                        <span>•</span>
                        <span>{item.type}</span>
                        <span>•</span>
                        <span className="text-[#dfb76c] font-semibold">
                          Rs. {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                      onClose();
                    }}
                    className="p-2 bg-[#dfb76c] hover:bg-[#caa053] text-black rounded transition-colors flex-shrink-0"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

