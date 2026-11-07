import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  Eye,
  ArrowRight,
  RotateCcw,
  Image as ImageIcon,
  Layers,
  Save,
  X,
} from 'lucide-react';
import { heroImagePresets, defaultHeroSlides } from '../../../data/heroSlides';

export default function HeroTab({
  heroSlides = [],
  setHeroSlides,
  productsList = [],
  showToast,
}) {
  const [slides, setSlides] = useState(() => {
    const list = heroSlides && heroSlides.length > 0 ? heroSlides : defaultHeroSlides;
    return list.filter((s) => s.id !== 'slide-1794063986881');
  });
  const [selectedSlideIdx, setSelectedSlideIdx] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever parent heroSlides updates
  useEffect(() => {
    if (heroSlides && heroSlides.length > 0) {
      const filtered = heroSlides.filter((s) => s.id !== 'slide-1794063986881');
      setSlides(filtered);
      setSelectedSlideIdx((prev) => (prev >= filtered.length ? Math.max(0, filtered.length - 1) : prev));
    }
  }, [heroSlides]);

  const activeSlide = slides[selectedSlideIdx] || slides[0] || defaultHeroSlides[0];

  // Helper to update active slide field
  const updateActiveSlide = (field, value) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === selectedSlideIdx ? { ...s, [field]: value } : s))
    );
  };

  // Upload image file from computer directly into assets/hero_bg_imgaes
  const handleBgImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'hero');

      const res = await fetch('/api/upload?type=hero', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          updateActiveSlide('bgImage', json.url);
          updateActiveSlide('bgKey', null);
          if (showToast) showToast(`Background image saved in assets/hero_bg_imgaes (${json.filename})`);
        }
      } else {
        // Fallback: Read as base64 and send to base64 upload endpoint
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64Content = ev.target.result;
          updateActiveSlide('bgImage', base64Content);
          updateActiveSlide('bgKey', null);

          try {
            const bRes = await fetch('/api/upload/base64?type=hero', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: file.name,
                base64Data: base64Content,
                type: 'hero',
              }),
            });
            if (bRes.ok) {
              const bJson = await bRes.json();
              updateActiveSlide('bgImage', bJson.url);
              if (showToast) showToast(`Background image saved in assets/hero_bg_imgaes (${bJson.filename})`);
            }
          } catch {}
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Save all slides to backend & broadcast
  const handleSaveHeroSlides = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides),
      });

      if (setHeroSlides) {
        setHeroSlides(slides);
      }
      try {
        localStorage.setItem('milestone_hero_slides', JSON.stringify(slides));
      } catch (e) {}

      if (showToast) {
        showToast('Hero banner settings saved successfully to live storefront!');
      }
    } catch (err) {
      if (setHeroSlides) setHeroSlides(slides);
      try {
        localStorage.setItem('milestone_hero_slides', JSON.stringify(slides));
      } catch (e) {}
      if (showToast) showToast('Hero settings saved locally');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new slide
  const handleAddSlide = async () => {
    const newSlideNumber = slides.length + 1;
    const newSlide = {
      id: `slide-${Date.now()}`,
      bgKey: null,
      bgImage: heroImagePresets.heroBg.image,
      tag: 'NEW ATELIER COLLECTION • SPECIAL RELEASE',
      titleLine1: `New Fragrance ${newSlideNumber}`,
      titleLine2: 'Pure Extrait De Parfum',
      description: 'Discover an uncompromising blend of rare woods, warm amber accords, and delicate florals handcrafted to perfection.',
      notes: 'Amber, Cedarwood & Bourbon Vanilla',
      product: productsList[0]?.name || 'Signature',
      price: 'Rs. 6,499',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setSelectedSlideIdx(updated.length - 1);

    if (setHeroSlides) {
      setHeroSlides(updated);
    }

    try {
      localStorage.setItem('milestone_hero_slides', JSON.stringify(updated));
      await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {}

    if (showToast) showToast(`Slide ${newSlideNumber} added! Customize its image and text below.`);
  };

  // Delete current slide immediately from state, localStorage, and backend
  const handleDeleteSlide = async (idxToDelete) => {
    if (slides.length <= 1) {
      if (showToast) showToast('At least one hero slide must remain in carousel', 'info');
      return;
    }

    const slideToDelete = slides[idxToDelete];
    const updated = slides.filter((_, idx) => idx !== idxToDelete);
    const newIdx = Math.max(0, Math.min(selectedSlideIdx, updated.length - 1));

    setSlides(updated);
    setSelectedSlideIdx(newIdx);

    // 1. Immediately update parent App.jsx state
    if (setHeroSlides) {
      setHeroSlides(updated);
    }

    // 2. Immediately update localStorage
    try {
      localStorage.setItem('milestone_hero_slides', JSON.stringify(updated));
    } catch (e) {}

    // 3. Immediately save updated list to backend API and disk
    try {
      if (slideToDelete?.id) {
        await fetch(`/api/hero/${slideToDelete.id}`, { method: 'DELETE' }).catch(() => {});
      }
      await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (showToast) showToast('Slide deleted successfully and removed from storefront!');
    } catch (err) {
      console.warn('Backend delete sync error:', err);
      if (showToast) showToast('Slide removed from carousel', 'info');
    }
  };

  // Reset to factory defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all hero banner slides to original factory presets?')) return;
    setSlides(defaultHeroSlides);
    setSelectedSlideIdx(0);
    if (setHeroSlides) setHeroSlides(defaultHeroSlides);
    try {
      localStorage.setItem('milestone_hero_slides', JSON.stringify(defaultHeroSlides));
      await fetch('/api/hero/reset', { method: 'POST' }).catch(() => {});
    } catch (e) {}
    if (showToast) showToast('Hero banner reset to factory defaults');
  };

  // Resolve background preview
  const resolvedBgImage =
    (activeSlide.bgKey && heroImagePresets[activeSlide.bgKey]?.image) ||
    activeSlide.bgImage ||
    heroImagePresets.heroBg.image;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header CTAs */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Home Hero Banner Customizer
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              Live Storefront
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Change background images, headlines, notes, and call-to-actions. All changes reflect instantly on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            title="Reset to original default slides"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveHeroSlides}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Banner Changes</span>
          </button>
        </div>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {slides.map((s, idx) => (
          <div
            key={s.id || idx}
            onClick={() => setSelectedSlideIdx(idx)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex-shrink-0 group ${
              selectedSlideIdx === idx
                ? 'bg-[#14120f] text-white shadow-md border border-[#dfb76c]'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#dfb76c]" />
            <span className="font-semibold">Slide {idx + 1}:</span>
            <span className="truncate max-w-[110px]">{s.titleLine1 || 'Fragrance'}</span>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSlide(idx);
                }}
                title={`Delete Slide ${idx + 1}`}
                className="opacity-40 hover:opacity-100 hover:text-red-400 p-0.5 rounded cursor-pointer transition-all ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleAddSlide}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-[#b38531] bg-white hover:bg-amber-50/40 text-stone-700 hover:text-[#b38531] text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Main Grid: Live Preview & Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-Time Visual Preview Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#b38531]" />
              <span>Real-time Hero Preview</span>
            </span>
            <span className="text-[11px] font-normal text-stone-500">
              Matches storefront aspect ratio & styling
            </span>
          </div>

          {/* Miniature Hero Component Preview */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d0b09] border border-[#2a241d] shadow-xl min-h-[360px] sm:min-h-[420px] flex items-center p-6 sm:p-10 select-none group">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-all duration-500"
              style={{
                backgroundImage: `url(${resolvedBgImage})`,
              }}
            />

            {/* Dark gradient overlay on left for typography readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09] via-[#0d0b09]/90 to-transparent pointer-events-none" />

            {/* Vignette overlays */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0d0b09]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0d0b09]/90 to-transparent pointer-events-none" />

            {/* Content inside preview */}
            <div className="relative z-10 max-w-sm sm:max-w-md text-left space-y-3 sm:space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#dfb76c]/40 text-[#dfb76c] text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-3 h-3 text-[#dfb76c]" />
                <span>{activeSlide.tag || 'EXCLUSIVE RELEASE'}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-4xl font-serif text-white leading-tight">
                <div>{activeSlide.titleLine1 || 'Milestone Fragrance'}</div>
                <div className="text-[#dfb76c] italic font-serif">
                  {activeSlide.titleLine2 || 'Crafted For Royalty'}
                </div>
              </h3>

              {/* Description */}
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                {activeSlide.description || 'A distinguished luxury fragrance crafted with exceptional longevity.'}
              </p>

              {/* Notes & Price */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="text-[11px] text-[#dfb76c] bg-black/60 px-2.5 py-0.5 rounded border border-[#dfb76c]/30">
                  Notes: <span className="text-stone-200">{activeSlide.notes}</span>
                </div>
                <div className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded border border-white/10">
                  {activeSlide.price}
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 bg-[#dfb76c] text-[#0d0c0a] font-semibold text-xs px-4 py-2 rounded shadow-md pointer-events-none">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Delete slide button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500 font-medium">
              Slide {selectedSlideIdx + 1} of {slides.length}
            </span>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteSlide(selectedSlideIdx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/80 hover:bg-red-100 text-xs font-semibold text-red-600 hover:text-red-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slide {selectedSlideIdx + 1}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Slide Controls & Image Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Background Image Changer */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#b38531]" />
                <span>Hero Background Image</span>
              </label>
              <span className="text-[10px] text-stone-500 font-medium">High-Res Landscape</span>
            </div>

            {/* Upload from Computer into assets/hero_bg_imgaes */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Upload Background File
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  Stored in: <code className="text-[#b38531] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">assets/hero_bg_imgaes/</code>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label
                  htmlFor="hero-bg-upload"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
                >
                  {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploading ? 'Uploading & Saving...' : 'Upload Background Image'}</span>
                </label>
                <input
                  id="hero-bg-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleBgImageUpload}
                  className="hidden"
                />

                {activeSlide.bgImage && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md truncate max-w-full">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Active: {activeSlide.bgImage.split('/').pop()}</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-stone-500 leading-snug">
                Select any landscape image from your device (PNG, JPG, WEBP). It will be saved directly into <strong className="text-stone-700 font-semibold">assets/hero_bg_imgaes/</strong> and rendered as this slide's background on the storefront.
              </p>
            </div>
          </div>

          {/* 2. Text & Typography Fields */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-1 border-b border-stone-100">
              Slide Typography & Content
            </h4>

            {/* Tagline Badge */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Top Tagline Badge
              </label>
              <input
                type="text"
                placeholder="e.g. GHANAM RANGE • ORIENTAL HERITAGE"
                value={activeSlide.tag || ''}
                onChange={(e) => updateActiveSlide('tag', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            {/* Title Line 1 */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Headline Line 1 (Main Text)
              </label>
              <input
                type="text"
                placeholder="e.g. Ghanam Range"
                value={activeSlide.titleLine1 || ''}
                onChange={(e) => updateActiveSlide('titleLine1', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            {/* Title Line 2 */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Headline Line 2 (Gold Serif Italic Accent)
              </label>
              <input
                type="text"
                placeholder="e.g. Crafted For Royalty"
                value={activeSlide.titleLine2 || ''}
                onChange={(e) => updateActiveSlide('titleLine2', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Description Paragraph
              </label>
              <textarea
                rows={3}
                placeholder="A rich oriental scent with a modern touch..."
                value={activeSlide.description || ''}
                onChange={(e) => updateActiveSlide('description', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white resize-none"
              />
            </div>

            {/* Fragrance Notes & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Key Fragrance Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saffron, Amber & Oud"
                  value={activeSlide.notes || ''}
                  onChange={(e) => updateActiveSlide('notes', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Displayed Price
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rs. 6,499"
                  value={activeSlide.price || ''}
                  onChange={(e) => updateActiveSlide('price', e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>
            </div>

            {/* Product ID linked */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Target Product On Click ("Shop Now")
              </label>
              <select
                value={activeSlide.product || activeSlide.id || ''}
                onChange={(e) => updateActiveSlide('product', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
              >
                {productsList.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.gender} • Rs. {p.price})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

