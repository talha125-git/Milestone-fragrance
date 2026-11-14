import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  Wind,
  Droplets,
  Layers,
  Save,
} from 'lucide-react';
import { prodSignature } from '../../assets';

export default function AddProductTab({ onAddProduct, showToast }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subtitle: 'art. 023 Edition',
    tagline: '',
    price: 6499,
    originalPrice: 7999,
    sizePrices: {
      '100ml': 9999,
      '50ml': 6499,
      '30ml': 4299,
      '10ml': 1999,
    },
    gender: 'Unisex',
    type: 'Woody',
    concentration: 'Extrait De Parfum',
    size: '50ml / 1.7 fl.oz',
    description: '',
    topNotes: 'Italian Bergamot, Cardamom, Pink Pepper',
    heartNotes: 'Smoky Cedarwood, Golden Ambergris, Incense',
    baseNotes: 'Rich Agarwood (Oud), Bourbon Vanilla, Patchouli',
    inStock: true,
    stockQuantity: 25,
    bestSeller: false,
    isNewArrival: true,
    image: prodSignature,
    hoverImage: '',
    images: [],
    longevity: '12+ Hours',
    sillage: 'Strong Sillage',
    howToApply: '',
    craftStory: '',
  });

  // Upload status helpers
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingHover, setIsUploadingHover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Generic file uploader to backend /api/upload with fallback to base64
  const uploadImageFile = async (file) => {
    return new Promise(async (resolve) => {
      try {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            return resolve(json.url);
          }
        }
      } catch (e) {
        console.warn('Backend upload failed, falling back to base64:', e);
      }
      // Base64 fallback
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });
  };

  // Main Image Handler
  const handleMainImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMain(true);
    const url = await uploadImageFile(file);
    setFormData((prev) => ({ ...prev, image: url }));
    setIsUploadingMain(false);
    if (showToast) showToast('Primary bottle image updated');
  };

  // Hover Image Handler
  const handleHoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHover(true);
    const url = await uploadImageFile(file);
    setFormData((prev) => ({ ...prev, hoverImage: url }));
    setIsUploadingHover(false);
    if (showToast) showToast('Storefront hover image uploaded');
  };

  // Gallery Image Handler (Up to 6 images)
  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 6 - (formData.images?.length || 0);
    if (availableSlots <= 0) {
      if (showToast) showToast('Maximum 6 gallery images reached', 'info');
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    setIsUploadingGallery(true);

    const uploadedUrls = [];
    for (const file of filesToUpload) {
      const url = await uploadImageFile(file);
      uploadedUrls.push(url);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls].slice(0, 6),
    }));
    setIsUploadingGallery(false);
    if (showToast) showToast(`Added ${uploadedUrls.length} gallery image(s)`);
  };

  // Remove individual gallery image
  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Add gallery image by direct URL
  const handleAddGalleryUrl = () => {
    const url = window.prompt('Enter image URL for gallery:');
    if (!url || !url.trim()) return;
    if ((formData.images?.length || 0) >= 6) {
      if (showToast) showToast('Maximum 6 gallery images allowed', 'info');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), url.trim()].slice(0, 6),
    }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (showToast) showToast('Fragrance name is required', 'info');
      return;
    }

    setIsSubmitting(true);
    const generatedId = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProduct = {
      ...formData,
      id: generatedId || `fragrance-${Date.now()}`,
      price: Number(formData.price) || 6499,
      originalPrice: Number(formData.originalPrice) || 7999,
      rating: 5,
      reviewsCount: 0,
      stockQuantity: Number(formData.stockQuantity) || 25,
      topNotes: typeof formData.topNotes === 'string'
        ? formData.topNotes.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.topNotes,
      heartNotes: typeof formData.heartNotes === 'string'
        ? formData.heartNotes.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.heartNotes,
      baseNotes: typeof formData.baseNotes === 'string'
        ? formData.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.baseNotes,
    };

    if (onAddProduct) {
      onAddProduct(newProduct);
    }
    setIsSubmitting(false);
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header / Breadcrumbs Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#b38531] font-semibold mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fragrance Catalog</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight">
            Add New Fragrance
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Configure olfactory pyramid, pricing, bottle sizes, stock, hover animation, and multi-angle gallery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Publish Fragrance</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================== */}
        {/* SECTION 1: VISUAL MEDIA & SHOWCASE (MAIN, HOVER & GALLERY) */}
        {/* ========================================================== */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6 text-left">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#b38531]" />
              <span>Fragrance Visuals & Interactive Media</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Upload the main flacon shot, optional storefront hover image, and up to 6 gallery pictures for product details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1A. PRIMARY BOTTLE IMAGE */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#b38531]" />
                  <span>Primary Bottle Image *</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium">Default card & flacon</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                  <img
                    src={formData.image || prodSignature}
                    alt="Main Fragrance Preview"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                  {isUploadingMain && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] gap-1">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#dfb76c]" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label
                    htmlFor="main-image-upload"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Bottle Image</span>
                  </label>
                  <input
                    id="main-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                  <div className="text-[11px] text-stone-500">Or paste image URL:</div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#b38531]"
                  />
                </div>
              </div>
            </div>

            {/* 1B. STOREFRONT HOVER IMAGE (NEW FEATURE!) */}
            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#dfb76c]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#b38531]" />
                  <span>Storefront Hover Image</span>
                </span>
                <span className="text-[10px] font-bold text-[#b38531] bg-[#dfb76c]/20 px-2 py-0.5 rounded-full">
                  Interactive Card
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs group">
                  {formData.hoverImage ? (
                    <img
                      src={formData.hoverImage}
                      alt="Hover Preview"
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  ) : (
                    <div className="text-center p-2 text-stone-400">
                      <Eye className="w-6 h-6 mx-auto mb-1 opacity-40" />
                      <span className="text-[10px] block leading-tight">No hover image set</span>
                    </div>
                  )}
                  {isUploadingHover && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] gap-1">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#dfb76c]" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="hover-image-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#14120f] hover:bg-stone-800 text-[#dfb76c] text-xs font-semibold cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Hover Shot</span>
                    </label>
                    <input
                      id="hover-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleHoverImageChange}
                      className="hidden"
                    />

                    {formData.hoverImage && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, hoverImage: '' }))}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Hover Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-600 leading-snug">
                    When shoppers hover on this perfume in catalog & home, this image crossfades in smoothly.
                  </p>
                  <input
                    type="text"
                    placeholder="Paste hover image URL..."
                    value={formData.hoverImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hoverImage: e.target.value }))}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#b38531]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 1C. ADDITIONAL GALLERY IMAGES (UP TO 6 IMAGES!) */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#b38531]" />
                  <span>Product Details Multi-Angle Gallery</span>
                  <span className="text-[#b38531] font-mono text-xs">
                    ({formData.images?.length || 0} / 6 Images)
                  </span>
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Customers can switch between these photos on the product details page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={(formData.images?.length || 0) >= 6}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                >
                  + Add via URL
                </button>
                <label
                  htmlFor="gallery-images-upload"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all ${
                    (formData.images?.length || 0) >= 6 ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                </label>
                <input
                  id="gallery-images-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                  disabled={(formData.images?.length || 0) >= 6}
                />
              </div>
            </div>

            {/* 6 Gallery Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                const imgUrl = formData.images?.[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className="relative aspect-square rounded-xl bg-white border border-stone-200 p-2 flex flex-col items-center justify-center overflow-hidden shadow-xs group"
                  >
                    {imgUrl ? (
                      <>
                        <img
                          src={imgUrl}
                          alt={`Gallery ${slotIdx + 1}`}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-[#dfb76c] text-[9px] font-bold px-1.5 py-0.5 rounded">
                          #{slotIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(slotIdx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <label
                        htmlFor={`slot-upload-${slotIdx}`}
                        className="w-full h-full border-2 border-dashed border-stone-200 hover:border-[#b38531] rounded-lg flex flex-col items-center justify-center text-stone-400 hover:text-[#b38531] cursor-pointer transition-colors p-1"
                      >
                        <Plus className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-medium text-center">Photo {slotIdx + 1}</span>
                        <input
                          id={`slot-upload-${slotIdx}`}
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadImageFile(file);
                            setFormData((prev) => {
                              const copy = [...(prev.images || [])];
                              copy[slotIdx] = url;
                              return { ...prev, images: copy.filter(Boolean) };
                            });
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECTION 2: BASIC FRAGRANCE DETAILS & OVERVIEW             */}
        {/* ========================================================== */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Fragrance Profile & Brand Narrative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Fragrance Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Professor, Signature, Believe"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Edition / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. art. 023 Edition, Pour Homme"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
              Short Tagline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. A rich woody blend with smoky cedar and warm amber."
              value={formData.tagline}
              onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
              Fragrance Description & Scent Story
            </label>
            <textarea
              rows={3}
              placeholder="Describe the mood, opening radiance, heart evolution, and long-lasting impression..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECTION 3: CLASSIFICATION, GENDER & OLFACTORY PYRAMID     */}
        {/* ========================================================== */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Olfactory Pyramid & Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Gender Profile
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              >
                <option value="Unisex">Unisex (Signature)</option>
                <option value="Men">Men (Pour Homme)</option>
                <option value="Women">Women (Pour Femme)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Fragrance Family
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              >
                <option value="Woody">Woody</option>
                <option value="Fresh">Fresh</option>
                <option value="Floral">Floral</option>
                <option value="Sweet">Sweet</option>
                <option value="Fruity">Fruity</option>
                <option value="Citrus">Citrus</option>
                <option value="Oriental">Oriental</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Concentration Grade
              </label>
              <select
                value={formData.concentration}
                onChange={(e) => setFormData((prev) => ({ ...prev, concentration: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              >
                <option value="Extrait De Parfum">Extrait De Parfum (30%+ Oil)</option>
                <option value="Eau De Parfum">Eau De Parfum (20% Oil)</option>
                <option value="Parfum">Parfum</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Top Notes (Opening)
              </label>
              <input
                type="text"
                placeholder="e.g. Italian Bergamot, Cardamom"
                value={formData.topNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, topNotes: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Heart Notes (Core)
              </label>
              <input
                type="text"
                placeholder="e.g. Smoky Cedarwood, Ambergris"
                value={formData.heartNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, heartNotes: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Base Notes (Dry-down)
              </label>
              <input
                type="text"
                placeholder="e.g. Agarwood Oud, Bourbon Vanilla"
                value={formData.baseNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, baseNotes: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Longevity
              </label>
              <input
                type="text"
                placeholder="e.g. 12+ Hours"
                value={formData.longevity}
                onChange={(e) => setFormData((prev) => ({ ...prev, longevity: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Sillage & Projection
              </label>
              <input
                type="text"
                placeholder="e.g. Strong Sillage, Heavy"
                value={formData.sillage}
                onChange={(e) => setFormData((prev) => ({ ...prev, sillage: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECTION 4: PRICING & BOTTLE SIZES                          */}
        {/* ========================================================== */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Pricing & Multi-Size Options (PKR)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Retail Price (PKR) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Compare At / Original Price (PKR)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531]"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Bottle Size Specific Pricing:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['100ml', '50ml', '30ml', '10ml'].map((sz) => (
                <div key={sz} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">{sz} Flacon</span>
                  <input
                    type="number"
                    value={formData.sizePrices?.[sz] || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        sizePrices: { ...prev.sizePrices, [sz]: val },
                      }));
                    }}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#b38531]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECTION 5: INVENTORY, BADGES & HIGHLIGHTS                  */}
        {/* ========================================================== */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3">
            Inventory & Storefront Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))}
                className="w-4 h-4 text-[#b38531] rounded"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">In Stock</span>
                <span className="text-[10px] text-stone-500">Available for customer checkout</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData((prev) => ({ ...prev, isNewArrival: e.target.checked }))}
                className="w-4 h-4 text-[#b38531] rounded"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">★ New Arrival</span>
                <span className="text-[10px] text-stone-500">Feature in New Arrivals collection</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bestSeller}
                onChange={(e) => setFormData((prev) => ({ ...prev, bestSeller: e.target.checked }))}
                className="w-4 h-4 text-[#b38531] rounded"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 block">Bestseller Flacon</span>
                <span className="text-[10px] text-stone-500">Feature on homepage Best Sellers</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons at bottom */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Publish Fragrance to Catalog</span>
          </button>
        </div>
      </form>
    </div>
  );
}

