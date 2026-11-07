import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Droplets,
  Clock,
  Wind,
  Share2,
} from 'lucide-react';
import { products } from '../data/products';

export default function ProductDetail({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  wishlist = [],
  onSelectProduct,
  onNavigate,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Look up product by URL param :id, or fallback to passed prop or first product
  const currentProduct =
    (id && products.find((p) => p.id.toLowerCase() === id.toLowerCase())) ||
    product ||
    products[0];

  const effectiveIsWishlisted =
    isWishlisted !== undefined
      ? isWishlisted
      : Array.isArray(wishlist) && wishlist.some((w) => w.id === currentProduct?.id);

  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedSize('50ml');
    setQuantity(1);
    setAdded(false);
  }, [currentProduct?.id]);

  const currentPrice =
    selectedSize === '50ml'
      ? currentProduct.price
      : Math.round(currentProduct.price * 1.7);

  const originalPrice =
    selectedSize === '50ml'
      ? currentProduct.originalPrice
      : Math.round(currentProduct.originalPrice * 1.7);

  const savingsPercent = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  const handleAdd = () => {
    onAddToCart(
      {
        ...currentProduct,
        size: `${selectedSize} / ${selectedSize === '50ml' ? '1.7' : '3.4'} fl.oz`,
        price: currentPrice,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${currentProduct.name} - Milestone Fragrances`,
          text: currentProduct.tagline,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Related products (all except current one)
  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 3);

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-10 text-xs text-stone-400">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('/collections');
              else navigate('/collections');
            }}
            className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#dfb76c] transition-colors focus:outline-none cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </button>

          <nav className="flex items-center gap-2 text-stone-400 text-xs">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/');
                else navigate('/');
              }}
              className="hover:text-[#dfb76c] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/collections');
                else navigate('/collections');
              }}
              className="hover:text-[#dfb76c] transition-colors cursor-pointer"
            >
              Collections
            </button>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-[#dfb76c] font-medium">{currentProduct.name}</span>
          </nav>
        </div>

        {/* Main Product Showcase (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 sm:mb-24">
          {/* Left Column: Image Display with Ambient Studio Lighting */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative group w-full max-w-[500px]">
              {/* Golden Ambient Glow */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(223,183,108,0.25)_0%,rgba(200,140,50,0.1)_45%,transparent_75%)] blur-2xl pointer-events-none transition-opacity duration-700 opacity-90" />

              {/* Main Image Stage */}
              <div className="relative aspect-square w-full rounded-2xl bg-[#FAF6F0] p-8 sm:p-12 flex items-center justify-center overflow-hidden border border-stone-200/90 shadow-2xl">
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="bg-black/90 backdrop-blur-md text-[#dfb76c] text-[10px] sm:text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded shadow-sm border border-[#dfb76c]/30">
                    {currentProduct.concentration}
                  </span>
                  <span className="bg-[#dfb76c] text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm">
                    {currentProduct.type}
                  </span>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  aria-label="Share fragrance"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#b38531] flex items-center justify-center transition-all shadow-md focus:outline-none cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {copied && (
                  <span className="absolute top-14 right-4 z-20 text-[10px] bg-black text-[#dfb76c] px-2 py-1 rounded shadow">
                    Link Copied!
                  </span>
                )}

                {/* Perfume Bottle Image */}
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Pedestal Shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-5 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,transparent_75%)] blur-md pointer-events-none" />
            </div>

            {/* Quick Feature Badges below image */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[500px] mt-6 text-center">
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Clock className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">12+ Hours</span>
                <span className="text-[10px] text-stone-400">Longevity</span>
              </div>
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Wind className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">Strong Sillage</span>
                <span className="text-[10px] text-stone-400">Projection</span>
              </div>
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Droplets className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">25%+ Extrait</span>
                <span className="text-[10px] text-stone-400">Oil Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Area */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentProduct.gender} Collection • {currentProduct.type}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
                {currentProduct.name}
              </h1>

              {currentProduct.subtitle && (
                <p className="text-stone-400 text-sm sm:text-base italic font-serif mt-1">
                  {currentProduct.subtitle}
                </p>
              )}
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex text-[#dfb76c]">
                {[...Array(currentProduct.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#dfb76c] text-[#dfb76c]" />
                ))}
              </div>
              <span className="text-xs text-stone-300 font-medium">
                5.0 ({currentProduct.reviewsCount || 100} verified customer reviews)
              </span>
            </div>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-3.5 pt-1 border-t border-[#221e1a]">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#dfb76c]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {originalPrice > currentPrice && (
                <>
                  <span className="text-base text-stone-500 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 px-2.5 py-1 rounded">
                    Save {savingsPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Story Description */}
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Fragrance Notes Architecture */}
            <div className="bg-[#14120f] border border-[#262018] rounded-xl p-4 sm:p-5 space-y-3">
              <div className="text-[#dfb76c] text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Olfactory Pyramid & Notes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-[#191612] p-3 rounded-lg border border-[#2b241c]">
                  <span className="text-[10px] text-[#dfb76c] font-semibold tracking-wider uppercase block mb-1">
                    Top Notes
                  </span>
                  <span className="text-xs text-stone-200 leading-snug block">
                    {currentProduct.topNotes ? currentProduct.topNotes.join(', ') : 'Citrus, Bergamot, Spices'}
                  </span>
                </div>

                <div className="bg-[#191612] p-3 rounded-lg border border-[#2b241c]">
                  <span className="text-[10px] text-[#dfb76c] font-semibold tracking-wider uppercase block mb-1">
                    Heart Notes
                  </span>
                  <span className="text-xs text-stone-200 leading-snug block">
                    {currentProduct.heartNotes ? currentProduct.heartNotes.join(', ') : 'Cedarwood, Amber, Jasmine'}
                  </span>
                </div>

                <div className="bg-[#191612] p-3 rounded-lg border border-[#2b241c]">
                  <span className="text-[10px] text-[#dfb76c] font-semibold tracking-wider uppercase block mb-1">
                    Base Notes
                  </span>
                  <span className="text-xs text-stone-200 leading-snug block">
                    {currentProduct.baseNotes ? currentProduct.baseNotes.join(', ') : 'Oud, Vanilla, Musk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="text-xs text-stone-400 font-semibold uppercase tracking-wider block mb-2.5">
                Select Bottle Volume
              </label>
              <div className="flex gap-3">
                {['50ml', '100ml'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`text-xs px-5 py-2.5 rounded-lg border transition-all cursor-pointer focus:outline-none ${
                      selectedSize === sz
                        ? 'border-[#dfb76c] bg-[#dfb76c]/15 text-[#dfb76c] font-semibold shadow-sm'
                        : 'border-[#262018] bg-[#14120f] text-stone-300 hover:border-stone-600'
                    }`}
                  >
                    <span className="block font-medium">{sz}</span>
                    <span className="text-[10px] text-stone-400">
                      {sz === '50ml' ? '1.7 fl.oz (Standard)' : '3.4 fl.oz (Grande)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity */}
              <div className="flex items-center border border-[#262018] rounded-lg bg-[#14120f]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-3 text-xs font-semibold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#dfb76c] hover:bg-[#caa053] active:scale-[0.99] text-[#0d0c0a] font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • Rs. {(currentPrice * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(currentProduct)}
                aria-label="Toggle wishlist"
                className={`p-3.5 border rounded-lg transition-colors cursor-pointer ${
                  effectiveIsWishlisted
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-[#262018] bg-[#14120f] hover:border-stone-600 text-stone-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${effectiveIsWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Trust & Guarantee Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#221e1a] text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>Free Shipping &gt; Rs. 5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>100% Authentic Extrait</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>Easy 7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Performance, Scent Journey, How to Apply */}
        <div className="border-t border-[#221e1a] pt-12 mb-16 sm:mb-24">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 border-b border-[#221e1a] pb-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-[#dfb76c] text-black'
                  : 'text-stone-400 hover:text-white bg-[#14120f]'
              }`}
            >
              Fragrance Architecture
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'usage'
                  ? 'bg-[#dfb76c] text-black'
                  : 'text-stone-400 hover:text-white bg-[#14120f]'
              }`}
            >
              How to Apply & Wear
            </button>
            <button
              onClick={() => setActiveTab('craft')}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'craft'
                  ? 'bg-[#dfb76c] text-black'
                  : 'text-stone-400 hover:text-white bg-[#14120f]'
              }`}
            >
              The Atelier Craft
            </button>
          </div>

          <div className="max-w-3xl mx-auto text-left text-xs sm:text-sm text-stone-300 leading-relaxed bg-[#14120f] border border-[#262018] rounded-2xl p-6 sm:p-8">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white font-normal">
                  The Scent Story of {currentProduct.name}
                </h3>
                <p>
                  Handcrafted with over 25% fragrance oil concentration,{' '}
                  <strong className="text-white font-medium">{currentProduct.name}</strong> opens with an immediate, radiant projection and evolves gracefully through a multidimensional heart into a deep, velvety dry-down that lingers effortlessly on skin and garments for 12+ hours.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#262018] text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Concentration</span>
                    <span className="text-[#dfb76c] font-semibold">{currentProduct.concentration}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Olfactory Family</span>
                    <span className="text-[#dfb76c] font-semibold">{currentProduct.type}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Optimal Wear</span>
                    <span className="text-[#dfb76c] font-semibold">Day to Evening</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Gender Profile</span>
                    <span className="text-[#dfb76c] font-semibold">{currentProduct.gender}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white font-normal">
                  Mastering Your Application
                </h3>
                <p>
                  For optimal sillage and longevity, apply your perfume onto pulse points where natural body warmth activates the fragrance molecules:
                </p>
                <ul className="list-disc list-inside space-y-2 text-stone-300">
                  <li>Hold the bottle 5–7 inches away and spray onto the sides of the neck, collarbone, and wrists.</li>
                  <li>Avoid rubbing wrists together after spraying — rubbing bruises delicate top notes.</li>
                  <li>For an extended scent trail, lightly spritz outerwear, scarves, or hair.</li>
                </ul>
              </div>
            )}

            {activeTab === 'craft' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white font-normal">
                  The Milestone Perfumery Standard
                </h3>
                <p>
                  Every bottle of Milestone Fragrance is compounded using sustainably harvested botanical extracts and grade-A French aroma compounds. Aged for 6 weeks in stainless steel maturation vats before filtration, our perfumes achieve smooth roundness and remarkable skin affinity without synthetic harshness.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like / Related Fragrances */}
        <div className="pt-8 border-t border-[#221e1a]">
          <div className="text-center mb-10">
            <p className="text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-1">
              COMPLEMENTARY CREATIONS
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(rel);
                  } else {
                    navigate(`/products/${rel.id}`);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-[#14120f] border border-[#262018] hover:border-[#dfb76c] rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-xl text-left"
              >
                <div className="aspect-square w-full bg-[#FAF6F0] rounded-lg p-3 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <span className="text-[#dfb76c] text-[10px] font-semibold uppercase tracking-wider">
                  {rel.gender} • {rel.type}
                </span>

                <h3 className="text-base font-serif font-bold text-white group-hover:text-[#dfb76c] transition-colors mt-0.5">
                  {rel.name}
                </h3>

                <p className="text-stone-400 text-xs line-clamp-1 mt-1 mb-3">
                  {rel.tagline}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#221e1a]">
                  <span className="text-white font-bold text-sm">
                    Rs. {rel.price.toLocaleString()}
                  </span>
                  <span className="text-[#dfb76c] text-xs font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Discover &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

