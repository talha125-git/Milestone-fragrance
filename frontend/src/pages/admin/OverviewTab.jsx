import React from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';

export default function OverviewTab({
  totalRevenue = 0,
  orders = [],
  productsList = [],
  inStockCount = 0,
  outOfStockCount = 0,
  subscribers = [],
  setActiveTab,
  handleToggleStock,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Stat Cards Grid (Pure White on Off-White) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Real Revenue */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Store Revenue
            </span>
            <div className="p-2 bg-amber-50 text-[#b38531] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real-time from {orders.length} active orders</span>
          </div>
        </div>

        {/* 2. Real Orders */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Customer Orders
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
            {orders.length} Orders
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
            <span>
              {orders.filter((o) => o.status === 'Delivered').length} Delivered •{' '}
              {orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length} In Transit
            </span>
          </div>
        </div>

        {/* 3. Real Fragrance Catalog */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Fragrance Catalog
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
            {productsList.length} Perfumes
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className="text-emerald-600 font-semibold">{inStockCount} In Stock</span>
            <span className="text-stone-300">•</span>
            <span className="text-rose-600 font-semibold">{outOfStockCount} Out of Stock</span>
          </div>
        </div>

        {/* 4. Real Subscribers */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Newsletter VIPs
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
            {subscribers.length} Members
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-700 font-medium">
            <span>100% Verified Subscribers</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Recent Store Orders
              </h3>
              <p className="text-xs text-stone-500">
                Live orders placed through the online storefront.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-[#b38531] font-semibold hover:underline cursor-pointer"
            >
              View All ({orders.length}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Fragrance Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-[#b38531]">{o.id}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-stone-900">{o.customer}</div>
                      <div className="text-[10px] text-stone-500">{o.city}</div>
                    </td>
                    <td className="py-3.5 text-stone-600">
                      {o.items?.map((it, i) => (
                        <span key={i} className="inline-block mr-2">
                          {it.qty}x {it.name}
                        </span>
                      ))}
                    </td>
                    <td className="py-3.5 font-bold text-stone-900">
                      Rs. {Number(o.total).toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : o.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : o.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Catalog Status */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Live Catalog Status
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Current perfume stock levels in production.
            </p>

            <div className="space-y-3">
              {productsList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 bg-stone-50/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white border border-stone-200 rounded p-0.5 flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-serif text-xs font-bold text-stone-900">{p.name}</div>
                      <div className="text-[10px] text-stone-500">Rs. {p.price?.toLocaleString()}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStock(p)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
                      p.inStock
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Manage all {productsList.length} items</span>
            <button
              onClick={() => setActiveTab('products')}
              className="text-[#b38531] font-semibold hover:underline cursor-pointer"
            >
              Open Catalog &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

