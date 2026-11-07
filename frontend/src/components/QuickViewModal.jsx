import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = selectedSize === '50ml' ? product.price : Math.round(product.price * 1.7);
  const originalPrice = selectedSize === '50ml' ? product.originalPrice : Math.round(product.originalPrice * 1.7);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      size: `${selectedSize} / ${selectedSize === '50ml' ? '1.7' : '3.4'} fl.oz`,
      price: currentPrice,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-[#14120f] border border-[#262018] rounded-xl shadow-2xl p-5 sm:p-8 text-stone-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image Preview */}
            <div className="relative aspect-square rounded-xl bg-[#FAF6F0] p-6 flex items-center justify-center overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
              <span className="absolute top-4 left-4 bg-black/80 text-[#dfb76c] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                {product.concentration}
              </span>
            </div>

            {/* Product Details */}
            <div className="space-y-4 text-left">
              <div>
                <span className="text-[#dfb76c] text-[11px] font-semibold tracking-[0.2em] uppercase">
                  {product.gender} • {product.type}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {product.name}
                </h3>
                <p className="text-stone-400 text-xs italic">{product.subtitle}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#dfb76c]">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#dfb76c] text-[#dfb76c]" />
                  ))}
                </div>
                <span className="text-xs text-stone-400">
                  {product.rating}.0 ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#dfb76c]">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                <span className="text-sm text-stone-500 line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-medium">
                  Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                </span>
              </div>

              {/* Description */}
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
                {product.description}
              </p>

              {/* Fragrance Notes Pyramid */}
              <div className="bg-[#1a1714] border border-[#2c241a] rounded-lg p-3 space-y-2 text-xs">
                <div className="text-[#dfb76c] font-semibold uppercase tracking-wider text-[10px]">
                  Fragrance Notes
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Top</span>
                    <span className="text-stone-200">{product.topNotes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Heart</span>
                    <span className="text-stone-200">{product.heartNotes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Base</span>
                    <span className="text-stone-200">{product.baseNotes.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="text-xs text-stone-400 font-medium block mb-2">Bottle Size</label>
                <div className="flex gap-3">
                  {['50ml', '100ml'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-4 py-2 rounded border transition-colors ${
                        selectedSize === sz
                          ? 'border-[#dfb76c] bg-[#dfb76c]/10 text-[#dfb76c] font-semibold'
                          : 'border-stone-800 bg-[#171411] text-stone-300 hover:border-stone-600'
                      }`}
                    >
                      {sz} {sz === '50ml' ? '(1.7 fl.oz)' : '(3.4 fl.oz)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-stone-800 rounded bg-[#161310]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#dfb76c] hover:bg-[#cda153] text-black font-semibold text-xs sm:text-sm py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 border rounded transition-colors ${
                    isWishlisted
                      ? 'border-red-500 bg-red-500/10 text-red-500'
                      : 'border-stone-800 hover:border-stone-600 text-stone-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#dfb76c]" /> Free Shipping &gt; 5k
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" /> 100% Authentic
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#dfb76c]" /> Easy 7-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

