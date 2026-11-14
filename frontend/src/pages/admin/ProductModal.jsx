import React from 'react';
import { X, Image as ImageIcon, RefreshCw, Upload, Check, Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import { prodSignature, prodBelieve, prodGhanam, prodProfessor } from '../../assets';

export default function ProductModal({
  isOpen,
  isEdit,
  editingProduct,
  onClose,
  formData,
  setFormData,
  onSubmit,
  imagePreview,
  setImagePreview,
  selectedImageFile,
  setSelectedImageFile,
  isUploadingImage,
  uploadedAssetPath,
  setUploadedAssetPath,
  handleImageFileChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 text-stone-900 shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {isEdit ? `Edit Fragrance: ${editingProduct?.name}` : 'Add New Fragrance to Catalog'}
              </h3>
              <p className="text-xs text-stone-500">Configure notes, pricing, volume and stock details.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Product Image Upload Section (Stored in public/productimages) */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#b38531]" />
                  <span>Fragrance Bottle Image *</span>
                </label>
                <span className="text-[10px] text-stone-500 font-medium">
                  Stored in: <code className="text-[#b38531] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">public/productimages/</code>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Live Image Preview Stage */}
                <div className="relative w-28 h-28 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs group">
                  <img
                    src={imagePreview || formData.image || prodSignature}
                    alt="Fragrance Preview"
                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-[10px] gap-1">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#dfb76c]" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>

                {/* Upload Controls & Details */}
                <div className="flex-1 w-full space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label
                      htmlFor="fragrance-image-file"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{selectedImageFile ? 'Change Image File' : 'Upload Image File'}</span>
                    </label>
                    <input
                      id="fragrance-image-file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    {uploadedAssetPath ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved in {uploadedAssetPath}</span>
                      </span>
                    ) : selectedImageFile ? (
                      <span className="text-xs text-stone-600 font-medium truncate max-w-[200px]">
                        {selectedImageFile.name}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-stone-500 leading-snug">
                    Choose any perfume image from your computer (PNG, JPG, WEBP). It will be saved into <strong className="text-stone-700 font-semibold">public/productimages/</strong> and rendered on all product pages.
                  </p>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Or Choose Preset:</span>
                    {[
                      { label: 'Ghanam', img: prodGhanam },
                      { label: 'Believe', img: prodBelieve },
                      { label: 'Signature', img: prodSignature },
                      { label: 'Professor', img: prodProfessor },
                    ].map((pr) => (
                      <button
                        key={pr.label}
                        type="button"
                        onClick={() => {
                          setImagePreview(pr.img);
                          setFormData((f) => ({
                            ...f,
                            image: pr.img,
                            assetPath: `assets/prod_${pr.label.toLowerCase()}.png`,
                          }));
                          setSelectedImageFile(null);
                          setUploadedAssetPath(`assets/prod_${pr.label.toLowerCase()}.png`);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded border border-stone-200 bg-white hover:border-[#b38531] text-stone-700 hover:text-[#b38531] transition-colors cursor-pointer"
                      >
                        {pr.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Storefront Hover Image Section */}
            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#dfb76c]/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#b38531]" />
                  <span>Storefront Hover Image</span>
                </label>
                <span className="text-[10px] text-[#b38531] font-bold bg-[#dfb76c]/20 px-2 py-0.5 rounded-full">
                  Crossfade on card hover
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
                  {formData.hoverImage ? (
                    <img
                      src={formData.hoverImage}
                      alt="Hover Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-stone-400 text-center">No hover image</span>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="modal-hover-image-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14120f] hover:bg-stone-800 text-[#dfb76c] text-xs font-semibold cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.hoverImage ? 'Change Hover Image' : 'Upload Hover Image'}</span>
                    </label>
                    <input
                      id="modal-hover-image-file"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setFormData((prev) => ({ ...prev, hoverImage: ev.target.result }));
                        };
                        reader.readAsDataURL(file);

                        try {
                          const uploadData = new FormData();
                          uploadData.append('image', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
                          if (res.ok) {
                            const json = await res.json();
                            if (json.url) {
                              setFormData((prev) => ({ ...prev, hoverImage: json.url }));
                            }
                          }
                        } catch {}
                      }}
                      className="hidden"
                    />

                    {formData.hoverImage && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, hoverImage: '' }))}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Hover Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter hover image URL..."
                    value={formData.hoverImage || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hoverImage: e.target.value }))}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#b38531]"
                  />
                </div>
              </div>
            </div>

            {/* Product Details Gallery Images (Up to 6) */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#b38531]" />
                  <span>Gallery Photos ({formData.images?.length || 0} / 6)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt('Enter image URL:');
                    if (url && url.trim()) {
                      setFormData((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), url.trim()].slice(0, 6),
                      }));
                    }
                  }}
                  disabled={(formData.images?.length || 0) >= 6}
                  className="text-[10px] font-bold text-[#b38531] hover:underline cursor-pointer disabled:opacity-40"
                >
                  + Add via URL
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const img = formData.images?.[idx];
                  return (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg bg-white border border-stone-200 p-1 flex items-center justify-center overflow-hidden group shadow-2xs"
                    >
                      {img ? (
                        <>
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="absolute top-0.5 right-0.5 p-1 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={`modal-gallery-${idx}`}
                          className="w-full h-full border border-dashed border-stone-200 hover:border-[#b38531] rounded flex flex-col items-center justify-center text-stone-400 hover:text-[#b38531] cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[9px]">#{idx + 1}</span>
                          <input
                            id={`modal-gallery-${idx}`}
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setFormData((prev) => {
                                  const copy = [...(prev.images || [])];
                                  copy[idx] = ev.target.result;
                                  return { ...prev, images: copy.filter(Boolean) };
                                });
                              };
                              reader.readAsDataURL(file);

                              try {
                                const uploadData = new FormData();
                                uploadData.append('image', file);
                                const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
                                if (res.ok) {
                                  const json = await res.json();
                                  if (json.url) {
                                    setFormData((prev) => {
                                      const copy = [...(prev.images || [])];
                                      copy[idx] = json.url;
                                      return { ...prev, images: copy.filter(Boolean) };
                                    });
                                  }
                                }
                              } catch {}
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

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Perfume Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Reserve"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Subtitle / Edition
                </label>
                <input
                  type="text"
                  placeholder="e.g. الغنام Edition"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Retail Price (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData((f) => ({
                      ...f,
                      price: val,
                      sizePrices: {
                        ...(f.sizePrices || {}),
                        '50ml': val,
                      },
                    }));
                  }}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Original / Before-Discount Price (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Fragrance Family
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                >
                  <option value="Woody">Woody</option>
                  <option value="Fresh">Fresh</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Floral">Floral</option>
                  <option value="Sweet">Sweet</option>
                  <option value="Fruity">Fruity</option>
                </select>
              </div>
            </div>

            {/* Dynamic Bottle Size Pricing Section */}
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b38531]"></span>
                  <span>Bottle Sizes & Dynamic Pricing (Rs.) *</span>
                </label>
                <span className="text-[11px] text-stone-500 font-medium">
                  Dynamic prices for 100ML, 50ML, 30ML & 10ML
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* 100ML */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900">100ML</span>
                    <span className="text-[10px] text-stone-400 font-medium">Grande (3.4 oz)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizePrices?.['100ml'] ?? Math.round((Number(formData.price) || 6499) * 1.6)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((f) => ({
                          ...f,
                          sizePrices: {
                            ...(f.sizePrices || {}),
                            '100ml': val,
                          },
                        }));
                      }}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs font-bold rounded p-2 pl-9 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 50ML */}
                <div className="bg-white p-3 rounded-lg border border-[#b38531]/40 shadow-xs ring-1 ring-[#b38531]/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#b38531]">50ML (Standard)</span>
                    <span className="text-[10px] text-stone-400 font-medium">Base (1.7 oz)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizePrices?.['50ml'] ?? formData.price ?? 6499}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((f) => ({
                          ...f,
                          price: val,
                          sizePrices: {
                            ...(f.sizePrices || {}),
                            '50ml': val,
                          },
                        }));
                      }}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs font-bold rounded p-2 pl-9 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 30ML */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900">30ML</span>
                    <span className="text-[10px] text-stone-400 font-medium">Midi (1.0 oz)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizePrices?.['30ml'] ?? Math.round((Number(formData.price) || 6499) * 0.65)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((f) => ({
                          ...f,
                          sizePrices: {
                            ...(f.sizePrices || {}),
                            '30ml': val,
                          },
                        }));
                      }}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs font-bold rounded p-2 pl-9 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 10ML */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900">10ML</span>
                    <span className="text-[10px] text-stone-400 font-medium">Travel / Pocket</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.sizePrices?.['10ml'] ?? Math.round((Number(formData.price) || 6499) * 0.35)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData((f) => ({
                          ...f,
                          sizePrices: {
                            ...(f.sizePrices || {}),
                            '10ml': val,
                          },
                        }));
                      }}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs font-bold rounded p-2 pl-9 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 italic">
                * When customers select 100ML, 50ML, 30ML, or 10ML on product page, the price updates dynamically in real-time.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. A rich oriental scent with velvety saffron."
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Full Fragrance Description / Scent Story
              </label>
              <textarea
                rows={3}
                placeholder="A masterpiece created for the discerning connoisseur. Envelops you in warm amber and cedarwood..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Top Notes (Comma separated)
              </label>
              <input
                type="text"
                value={formData.topNotes}
                onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Heart Notes (Comma separated)
              </label>
              <input
                type="text"
                value={formData.heartNotes}
                onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Base Notes (Comma separated)
              </label>
              <input
                type="text"
                value={formData.baseNotes}
                onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
              />
            </div>

            {/* Performance Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Longevity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12+ Hours"
                  value={formData.longevity || '12+ Hours'}
                  onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Sillage & Projection
                </label>
                <input
                  type="text"
                  placeholder="e.g. Strong Sillage"
                  value={formData.sillage || 'Strong Sillage'}
                  onChange={(e) => setFormData({ ...formData, sillage: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531]"
                />
              </div>
            </div>

            {/* Dedicated Stock & Inventory Box */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                  Inventory & Stock Status *
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${formData.inStock ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                  {formData.inStock ? '● In Stock' : '✕ Out of Stock'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Availability Option
                  </label>
                  <select
                    value={formData.inStock ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer font-medium"
                  >
                    <option value="true">✓ In Stock (Available for Purchase)</option>
                    <option value="false">✕ Out of Stock (Mark as Sold Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Stock Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity !== undefined ? formData.stockQuantity : 25}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({
                        ...formData,
                        stockQuantity: val,
                        inStock: val > 0 ? formData.inStock : false,
                      });
                    }}
                    className="w-full bg-white border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="rounded border-stone-300 text-[#b38531] focus:ring-0 cursor-pointer"
                />
                <span>★ Mark as Bestseller</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isNewArrival)}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="rounded border-stone-300 text-[#b38531] focus:ring-0 cursor-pointer"
                />
                <span className="text-emerald-700 font-bold">★ Mark as New Arrival</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#b38531] hover:bg-[#966d21] text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {isEdit ? 'Save Changes' : 'Add to Catalog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

