import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12100e] text-stone-200 border-l border-[#241e17] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#241e17] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#dfb76c] fill-[#dfb76c]" />
              <h2 className="text-base font-semibold text-white tracking-wide">
                My Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Heart className="w-12 h-12 text-stone-600 mx-auto" />
                <p className="text-stone-400 text-sm">Your wishlist is empty.</p>
                <p className="text-stone-500 text-xs">Save your favorite fragrances to view them later.</p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-lg bg-[#181410] border border-[#2b2319] items-center justify-between"
                >
                  <div
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(item);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group/item flex-1"
                  >
                    <div className="w-16 h-16 bg-[#FAF6F0] rounded overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform group-hover/item:scale-105"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white font-serif group-hover/item:text-[#dfb76c] transition-colors">{item.name}</h4>
                      <p className="text-[11px] text-stone-400">{item.gender} • {item.type}</p>
                      <p className="text-xs font-semibold text-[#dfb76c] mt-0.5">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveFromWishlist(item.id);
                      }}
                      title="Move to Cart"
                      className="p-2 bg-[#dfb76c] hover:bg-[#c99f52] text-black rounded transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      title="Remove"
                      className="p-2 text-stone-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

