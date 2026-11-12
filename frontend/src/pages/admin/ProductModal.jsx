import React from 'react';
import { X, Image as ImageIcon, RefreshCw, Upload, Check } from 'lucide-react';
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
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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

