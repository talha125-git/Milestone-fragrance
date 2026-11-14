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
  ChevronLeft,
  Droplets,
  Clock,
  Wind,
  Share2,
  Zap,
  Eye,
  X,
} from 'lucide-react';
import { products as defaultProducts } from '../data/products';
import ProductReviews from '../components/ProductReviews';

export default function ProductDetail({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  wishlist = [],
  onSelectProduct,
  onNavigate,
  products: passedProducts,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;

  // Look up product by URL param :id, or fallback to passed prop or first product
  const currentProduct =
    (id && productList.find((p) => p.id.toLowerCase() === id.toLowerCase())) ||
    product ||
    productList[0];

  const effectiveIsWishlisted =
    isWishlisted !== undefined
      ? isWishlisted
      : Array.isArray(wishlist) && wishlist.some((w) => w.id === currentProduct?.id);

  const [selectedSize, setSelectedSize] = useState('100ml');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('usage');

  // Collect all unique images for this fragrance (Main + Hover + Gallery up to 6)
  const galleryImages = [
    currentProduct?.image,
    currentProduct?.hoverImage,
    ...(Array.isArray(currentProduct?.images) ? currentProduct.images : []),
  ].filter(Boolean);
  const uniqueGalleryImages = Array.from(new Set(galleryImages));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setSelectedSize('100ml');
    setQuantity(1);
    setAdded(false);
    setCurrentImageIndex(0);
  }, [currentProduct?.id, currentProduct?.image]);

  const activeImage = uniqueGalleryImages[currentImageIndex] || currentProduct?.image;

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    if (uniqueGalleryImages.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? uniqueGalleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    if (uniqueGalleryImages.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === uniqueGalleryImages.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation for full-screen lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, uniqueGalleryImages.length]);

  // Dynamic price resolution for bottle sizes (100ml, 50ml, 30ml, 10ml)
  const getSizePrice = (product, size) => {
    if (!product) return 0;
    const s = (size || '100ml').toLowerCase().trim();
    if (product.sizePrices && product.sizePrices[s] !== undefined && Number(product.sizePrices[s]) > 0) {
      return Number(product.sizePrices[s]);
    }
    const base = Number(product.price) || 6499;
    if (s === '10ml') return Math.round(base * 0.35);
    if (s === '30ml') return Math.round(base * 0.65);
    if (s === '50ml') return base;
    if (s === '100ml') return Math.round(base * 1.6);
    return base;
  };

  const getSizeOriginalPrice = (product, size) => {
    if (!product) return 0;
    const s = (size || '100ml').toLowerCase().trim();
    const cur = getSizePrice(product, size);
    if (product.originalPrice && product.price) {
      const diff = Number(product.originalPrice) - Number(product.price);
      return cur + (diff > 0 ? diff : 1500);
    }
    return cur + 1500;
  };

  const currentPrice = getSizePrice(currentProduct, selectedSize);
  const originalPrice = getSizeOriginalPrice(currentProduct, selectedSize);

  const savingsPercent = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(
      {
        ...currentProduct,
        size: selectedSize.toUpperCase(),
        price: currentPrice,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    onAddToCart(
      {
        ...currentProduct,
        size: selectedSize.toUpperCase(),
        price: currentPrice,
      },
      quantity
    );
    navigate('/checkout');
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
  const relatedProducts = productList
    .filter((p) => p.id !== currentProduct?.id)
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

                {/* Top-Right Action Buttons: Eye (Full Screen) & Share */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="View full size image on large screen"
                    title="View full screen"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#b38531] flex items-center justify-center transition-all shadow-md focus:outline-none cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share fragrance"
                    title="Share fragrance"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#b38531] flex items-center justify-center transition-all shadow-md focus:outline-none cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <span className="absolute top-14 right-4 z-20 text-[10px] bg-black text-[#dfb76c] px-2 py-1 rounded shadow">
                    Link Copied!
                  </span>
                )}

                {/* Left & Right Navigation Arrows */}
                {uniqueGalleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#b38531] flex items-center justify-center shadow-lg border border-stone-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <ChevronLeft className="w-5 h-5 -ml-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#b38531] flex items-center justify-center shadow-lg border border-stone-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <ChevronRight className="w-5 h-5 -mr-0.5" />
                    </button>

                    {/* Image indicator pill */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 text-white text-[10px] font-semibold">
                      <span>{currentImageIndex + 1}</span>
                      <span className="text-stone-400">/</span>
                      <span className="text-stone-300">{uniqueGalleryImages.length}</span>
                    </div>
                  </>
                )}

                {/* New Arrival Badge (Bottom-left so it never overlaps top-left badges) */}
                {currentProduct.isNewArrival && (
                  <span className="absolute bottom-4 left-4 z-10 bg-[#dfb76c] text-[#0d0c0a] font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-md tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>New Arrival</span>
                  </span>
                )}
                {currentProduct.inStock === false && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-white">
                    <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3.5 py-1.5 rounded-full shadow-lg tracking-wider mb-1">
                      Sold Out
                    </span>
                    <span className="text-[11px] text-stone-300 font-medium">Currently Out of Stock</span>
                  </div>
                )}
                <img
                  src={activeImage || currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:scale-105"
                />
              </div>

              {/* Pedestal Shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-5 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,transparent_75%)] blur-md pointer-events-none" />
            </div>

            {/* All Product Images Static Thumbnails (No Slider / No Scrollbar) */}
            {uniqueGalleryImages.length > 1 && (
              <div className="w-full max-w-[500px] mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {uniqueGalleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FAF6F0] p-1.5 flex items-center justify-center overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      currentImageIndex === idx
                        ? 'border-[#dfb76c] shadow-lg shadow-[#dfb76c]/30 scale-105 ring-2 ring-[#dfb76c]/40'
                        : 'border-[#262018] hover:border-stone-500 opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${currentProduct.name} angle ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {currentImageIndex === idx && (
                      <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#dfb76c]" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Feature Badges below image */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[500px] mt-6 text-center">
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Clock className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">{currentProduct.longevity || '12+ Hours'}</span>
                <span className="text-[10px] text-stone-400">Longevity</span>
              </div>
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Wind className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">{currentProduct.sillage || 'Strong Sillage'}</span>
                <span className="text-[10px] text-stone-400">Projection</span>
              </div>
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-3 flex flex-col items-center justify-center">
                <Droplets className="w-4 h-4 text-[#dfb76c] mb-1" />
                <span className="text-[11px] font-semibold text-white">
                  {currentProduct.concentration === 'Extrait De Parfum' ? '30%+ Extrait' : '25%+ Extrait'}
                </span>
                <span className="text-[10px] text-stone-400">Oil Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Area */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 text-[#dfb76c] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {currentProduct.gender} Collection • {currentProduct.type}
                  </span>
                </div>
                {currentProduct.isNewArrival && (
                  <span className="bg-[#dfb76c] text-[#0d0c0a] font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                    ★ New Arrival
                  </span>
                )}
                {currentProduct.inStock !== false ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Out of Stock</span>
                  </span>
                )}
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

            {/* Rating & Reviews (Clickable scroll to customer reviews) */}
            <div
              onClick={scrollToReviews}
              className="flex items-center gap-3 cursor-pointer group/rev transition-opacity hover:opacity-90 w-fit"
              title="Click to jump to customer reviews"
            >
              <div className="flex text-[#dfb76c]">
                {[...Array(currentProduct.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#dfb76c] text-[#dfb76c]" />
                ))}
              </div>
              <span className="text-xs text-stone-300 font-medium group-hover/rev:text-[#dfb76c] transition-colors flex items-center gap-1">
                <span>5.0 ({currentProduct.reviewsCount || 100} verified customer reviews)</span>
                <span className="text-[#dfb76c] text-[10px] font-bold">&darr;</span>
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
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-base font-sans font-medium text-stone-100 block tracking-wide">
                  Size
                </label>
                <span className="text-xs text-stone-400 font-sans">
                  Selected: <strong className="text-[#dfb76c] uppercase">{selectedSize}</strong> (Rs. {currentPrice.toLocaleString()})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {['100ml', '50ml', '30ml', '10ml'].map((sz) => {
                  const isSelected = selectedSize.toLowerCase() === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      aria-label={`Select size ${sz.toUpperCase()}`}
                      className={`min-w-[85px] sm:min-w-[105px] h-[46px] sm:h-[50px] transition-all cursor-pointer font-sans rounded-none select-none flex items-center justify-center ${
                        isSelected
                          ? 'border border-white p-[3px] bg-transparent'
                          : 'border border-stone-600 bg-transparent hover:border-stone-400'
                      }`}
                    >
                      {isSelected ? (
                        <div className="w-full h-full bg-[#1b251e] border border-stone-600/70 flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                            {sz.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-medium tracking-wider text-stone-300 uppercase hover:text-white">
                            {sz.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              {/* Quantity */}
              <div className={`flex items-center border border-[#262018] rounded-lg bg-[#14120f] ${currentProduct.inStock === false ? 'opacity-50 pointer-events-none' : ''}`}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={currentProduct.inStock === false}
                  className="px-3.5 py-3 text-stone-400 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-3 text-xs font-semibold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={currentProduct.inStock === false}
                  className="px-3.5 py-3 text-stone-400 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA with Out of Stock State */}
              {currentProduct.inStock === false ? (
                <button
                  disabled
                  className="flex-1 bg-stone-800 text-stone-500 border border-stone-700/80 font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Out of Stock • Sold Out</span>
                </button>
              ) : (
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
              )}

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

            {/* Buy Now Button Directly Below Add to Cart */}
            {currentProduct.inStock !== false && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-[#dfb76c] via-[#f5d99b] to-[#dfb76c] hover:brightness-110 active:scale-[0.99] text-[#120f0b] font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now — Rs. {(currentPrice * quantity).toLocaleString()}</span>
              </button>
            )}

            {/* Trust & Guarantee Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#221e1a] text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>{currentPrice >= 5000 ? 'Free Shipping (Qualified)' : 'Free Shipping > Rs. 5,000'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>100% Authentic {currentProduct.concentration || 'Extrait'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                <span>Easy 7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: How to Apply & The Atelier Craft */}
        {/* <div className="border-t border-[#221e1a] pt-12 mb-16 sm:mb-24">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 border-b border-[#221e1a] pb-4">
            <button
              onClick={() => setActiveTab('usage')}
              className={`text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'usage'
                  ? 'bg-[#dfb76c] text-black shadow-sm'
                  : 'text-stone-400 hover:text-white bg-[#14120f]'
              }`}
            >
              How to Apply & Wear
            </button>
            <button
              onClick={() => setActiveTab('craft')}
              className={`text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer ${
                activeTab === 'craft'
                  ? 'bg-[#dfb76c] text-black shadow-sm'
                  : 'text-stone-400 hover:text-white bg-[#14120f]'
              }`}
            >
              The Atelier Craft
            </button>
          </div>

          <div className="max-w-3xl mx-auto text-left text-xs sm:text-sm text-stone-300 leading-relaxed bg-[#14120f] border border-[#262018] rounded-2xl p-6 sm:p-8">
            {activeTab === 'usage' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white font-normal">
                  How to Apply & Wear {currentProduct.name}
                </h3>
                {currentProduct.howToApply ? (
                  <p className="text-stone-300 leading-relaxed whitespace-pre-line">
                    {currentProduct.howToApply}
                  </p>
                ) : (
                  <>
                    <p>
                      For optimal sillage and enduring longevity with{' '}
                      <strong className="text-white">{currentProduct.name}</strong> ({currentProduct.type} family):
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-stone-300">
                      <li>
                        Hold the flacon 5–7 inches away and spray directly onto pulse points where body warmth activates the perfume oils: sides of the neck, collarbone, and wrists.
                      </li>
                      <li>
                        Never rub wrists together after spraying — friction bruises delicate top notes and accelerates evaporation.
                      </li>
                      <li>
                        For an extended, magnetic scent aura, lightly spritz outerwear, jacket lapels, scarves, or hair.
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'craft' && (
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-white font-normal">
                  The Milestone Perfumery Standard: {currentProduct.name}
                </h3>
                {currentProduct.craftStory ? (
                  <p className="text-stone-300 leading-relaxed whitespace-pre-line">
                    {currentProduct.craftStory}
                  </p>
                ) : (
                  <p>
                    Every flacon of <strong className="text-white">{currentProduct.name}</strong> is compounded using sustainably harvested botanical essences and grade-A French aroma compounds, highlighting natural{' '}
                    <span className="text-[#dfb76c]">
                      {Array.isArray(currentProduct.topNotes) ? currentProduct.topNotes[0] : 'bergamot'}
                    </span>{' '}
                    and rich{' '}
                    <span className="text-[#dfb76c]">
                      {Array.isArray(currentProduct.baseNotes) ? currentProduct.baseNotes[0] : 'amber'}
                    </span>
                    . Matured for 6 weeks in stainless steel temperature-controlled vats before artisanal filtration, our perfumes achieve smooth roundness and remarkable skin affinity without synthetic harshness.
                  </p>
                )}
              </div>
            )}
          </div>
        </div> */}

        {/* Customer Reviews Section (PerfumePlus & Judge.me Style) */}
        <ProductReviews product={currentProduct} />

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
                }}
                className="group bg-[#14120f] border border-[#262018] hover:border-[#dfb76c] rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-xl text-left"
              >
                <div className="relative aspect-square w-full bg-[#FAF6F0] rounded-lg p-3 flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className={`w-full h-full object-contain p-1 transition-all duration-500 ${
                      rel.hoverImage
                        ? 'group-hover:opacity-0 group-hover:scale-105'
                        : 'group-hover:scale-105'
                    }`}
                  />
                  {rel.hoverImage && (
                    <img
                      src={rel.hoverImage}
                      alt={`${rel.name} hover view`}
                      className="absolute inset-0 w-full h-full object-contain p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  )}
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

      {/* Full-Screen Image Lightbox Modal (Click Eye Icon) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar with Fragrance Title & Close Button */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-white z-20">
            <div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-white">
                {currentProduct.name}
              </h4>
              <p className="text-xs text-stone-400">
                {uniqueGalleryImages.length > 1
                  ? `Photo ${currentImageIndex + 1} of ${uniqueGalleryImages.length}`
                  : 'Full Screen View'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close full view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Arrows in Lightbox */}
          {uniqueGalleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous full image"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next full image"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Large Image Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={`${currentProduct.name} full view`}
              className="max-h-[82vh] max-w-full object-contain filter drop-shadow-2xl animate-in zoom-in-95 duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

