import React from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ProductsTab({
  searchProductQuery,
  setSearchProductQuery,
  filterGender,
  setFilterGender,
  filteredProducts = [],
  handleOpenAddModal,
  handleOpenEditModal,
  handleToggleStock,
  setDeleteCandidate,
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Controls Bar: Search & Gender Filter & Add Button */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search fragrance by name, notes or family..."
              value={searchProductQuery}
              onChange={(e) => setSearchProductQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg pl-9 pr-3 py-2.5 placeholder-stone-400 focus:outline-none focus:border-[#b38531] focus:bg-white"
            />
          </div>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fragrance</span>
        </button>
      </div>

      {/* Fragrances Catalog Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">Fragrance Profile</th>
                <th className="py-3.5 px-4">Category & Notes</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Inventory Status</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Fragrance Name & Image */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 p-1 flex-shrink-0 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-serif text-sm font-bold text-stone-900 flex flex-wrap items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.bestSeller && (
                            <span className="bg-[#b38531] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                              Bestseller
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                              New Arrival
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">{p.tagline}</div>
                        <div className="text-[10px] font-mono text-[#b38531]">/products/{p.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Gender & Notes */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900">{p.gender}</span>
                    <span className="text-stone-400"> • </span>
                    <span className="text-stone-600">{p.type}</span>
                    <div className="text-[10px] text-stone-500 line-clamp-1">
                      {Array.isArray(p.topNotes) ? p.topNotes.slice(0, 2).join(', ') : 'Citrus, Spices'}
                    </div>
                  </td>

                  {/* Retail Price & Sizes */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 text-sm">
                      Rs. {Number(p.price).toLocaleString()}
                      <span className="text-[10px] font-normal text-stone-400 ml-1">(50ml)</span>
                    </div>
                    {p.sizePrices ? (
                      <div className="text-[10px] text-stone-500 font-medium space-x-1">
                        <span>100ML: Rs. {Number(p.sizePrices['100ml'] || Math.round(p.price * 1.6)).toLocaleString()}</span>
                        <span>•</span>
                        <span>10ML: Rs. {Number(p.sizePrices['10ml'] || Math.round(p.price * 0.35)).toLocaleString()}</span>
                      </div>
                    ) : p.originalPrice > p.price ? (
                      <div className="text-[10px] text-stone-400 line-through">
                        Rs. {Number(p.originalPrice).toLocaleString()}
                      </div>
                    ) : null}
                  </td>

                  {/* Stock Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStock(p)}
                      title="Click to instantly toggle stock status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{p.inStock ? `In Stock (${p.stockQuantity !== undefined ? p.stockQuantity : 'Avail'})` : 'Out of Stock'}</span>
                    </button>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <span>★ {p.rating || 5}.0</span>
                      <span className="text-[10px] text-stone-400 font-normal">({p.reviewsCount || 100})</span>
                    </div>
                  </td>

                  {/* Edit & Delete Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        title="Edit Product"
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(p)}
                        title="Delete Product"
                        className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

