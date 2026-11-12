import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Package,
  Trash2,
  Eye,
  X,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  Banknote,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export default function OrdersTab({
  orders = [],
  handleOrderStatusChange,
  handleDeleteOrder,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  // Toggle order dropdown expansion
  const toggleExpandOrder = (orderId) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders by query and status
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.id?.toLowerCase().includes(q) ||
      o.customer?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q) ||
      o.city?.toLowerCase().includes(q) ||
      (o.items && o.items.some((it) => it.name?.toLowerCase().includes(q)));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Controls Card */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Customer Orders</span>
              <span className="text-xs bg-[#b38531]/10 text-[#b38531] font-bold font-sans px-2.5 py-0.5 rounded-full border border-[#b38531]/20">
                {orders.length} Total
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Click on any order or the <strong>Order Details ∨</strong> dropdown to view complete delivery address, contact & item breakdown.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search ID, customer, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#b38531]"
            />
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
            const count = st === 'all' ? orders.length : orders.filter((o) => o.status === st).length;
            const isSelected = statusFilter.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#b38531] text-white font-semibold shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                }`}
              >
                {st === 'all' ? 'All Orders' : st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table with Expandable Dropdown Rows */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">ORDER REF & DATE</th>
                <th className="py-3.5 px-4">CUSTOMER DETAILS</th>
                <th className="py-3.5 px-4">PURCHASED FRAGRANCE(S)</th>
                <th className="py-3.5 px-4">TOTAL AMOUNT</th>
                <th className="py-3.5 px-4">PAYMENT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold text-sm text-stone-700">No Orders Found</p>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                      {orders.length === 0
                        ? 'Customer orders placed through the website checkout will appear here in real-time.'
                        : 'No orders match your search criteria. Try a different search term or filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isExpanded = expandedOrderIds.has(o.id);
                  return (
                    <React.Fragment key={o.id}>
                      {/* Main Table Row */}
                      <tr
                        onClick={() => toggleExpandOrder(o.id)}
                        className={`transition-colors cursor-pointer select-none ${
                          isExpanded
                            ? 'bg-amber-50/40 border-l-4 border-l-[#b38531]'
                            : 'hover:bg-stone-50/80 border-l-4 border-l-transparent'
                        }`}
                      >
                        {/* Order ID & Date with Toggle Chevron */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1 rounded-md transition-transform ${
                                isExpanded ? 'bg-amber-100 text-[#b38531] rotate-180' : 'text-stone-400'
                              }`}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <div className="font-bold text-[#b38531] font-mono">{o.id}</div>
                              <div className="text-[10px] text-stone-400">{o.date || 'Recent'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{o.customer}</div>
                          <div className="text-[11px] text-stone-500">{o.phone}</div>
                          <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{o.city}</span>
                          </div>
                        </td>

                        {/* Fragrance Items */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {o.items?.map((it, idx) => (
                              <div key={idx} className="font-medium text-stone-800 flex items-center gap-1.5">
                                <span className="font-bold text-stone-900">{it.qty}x</span>
                                <span>{it.name}</span>
                                <span className="text-[10px] font-bold text-[#b38531] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  {it.size || '100ML'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900 text-sm">
                            Rs. {Number(o.total).toLocaleString()}
                          </div>
                          {o.discount > 0 && (
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              Saved Rs. {Number(o.discount).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Payment Method */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            <Banknote className="w-3 h-3 text-stone-500" />
                            <span>{o.payment || 'Cash on Delivery'}</span>
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block">
                            <select
                              value={o.status || 'Pending'}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none cursor-pointer border appearance-none transition-all ${
                                o.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : o.status === 'Shipped'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                  : o.status === 'Processing'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                  : o.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70" />
                          </div>
                        </td>

                        {/* Actions: Dropdown Button & Delete */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {/* Dropdown Toggle Button Styled Like the Status Dropdown */}
                            <button
                              type="button"
                              onClick={() => toggleExpandOrder(o.id)}
                              title="Click to toggle order details dropdown"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border shadow-xs ${
                                isExpanded
                                  ? 'bg-[#b38531] text-white border-[#b38531]'
                                  : 'bg-amber-50 hover:bg-amber-100 text-[#b38531] border-amber-200'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {handleDeleteOrder && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(o.id)}
                                title="Delete order"
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Order Details Dropdown Panel */}
                      {isExpanded && (
                        <tr className="bg-amber-50/25 border-b border-stone-200/90 transition-all">
                          <td colSpan={7} className="p-3 sm:p-5">
                            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200 text-stone-900">
                              {/* Dropdown Panel Top Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-[#b38531] flex items-center justify-center font-bold">
                                    <Package className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                                        Order Manifest: {o.id}
                                      </h4>
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(o.id)}
                                        title="Copy Order ID"
                                        className="text-[10px] text-stone-400 hover:text-[#b38531] flex items-center gap-1 font-mono"
                                      >
                                        <Copy className="w-3 h-3" />
                                        <span>{copiedId === o.id ? 'Copied!' : 'Copy'}</span>
                                      </button>
                                    </div>
                                    <span className="text-[11px] text-stone-400">
                                      Placed on {o.date || 'Recent'} • Customer: <strong>{o.customer}</strong>
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandOrder(o.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[#b38531] border border-amber-200 text-xs font-semibold cursor-pointer"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>Collapse Details</span>
                                  </button>
                                </div>
                              </div>

                              {/* Three Columns: Customer & Address | Items | Financials */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                                {/* 1. Customer & Shipping Destination */}
                                <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                      Customer & Courier Dispatch
                                    </span>
                                    {o.phone && (
                                      <a
                                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded hover:bg-emerald-100"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WhatsApp</span>
                                      </a>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <p className="font-bold text-stone-900 text-sm">{o.customer}</p>
                                    <p className="flex items-center gap-1.5 text-stone-600">
                                      <Phone className="w-3.5 h-3.5 text-[#b38531] flex-shrink-0" />
                                      <a href={`tel:${o.phone}`} className="hover:underline font-semibold text-stone-800">
                                        {o.phone}
                                      </a>
                                    </p>
                                    {o.email && (
                                      <p className="flex items-center gap-1.5 text-stone-600">
                                        <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                        <span>{o.email}</span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="pt-2 border-t border-stone-200/80 space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                      Delivery Address:
                                    </span>
                                    <p className="text-stone-800 font-medium">
                                      {o.address || 'Standard Delivery Address'}
                                    </p>
                                    <p className="text-stone-500 font-semibold">
                                      {o.city} {o.postalCode ? `• Postal: ${o.postalCode}` : ''}
                                    </p>
                                  </div>

                                  {o.notes && (
                                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
                                      <strong className="block text-[10px] uppercase font-bold text-[#b38531]">
                                        Special Customer Note:
                                      </strong>
                                      <span>"{o.notes}"</span>
                                    </div>
                                  )}
                                </div>

                                {/* 2. Purchased Items & Bottle Sizes */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                    Fragrances In This Order ({o.items?.length || 0})
                                  </span>
                                  <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden bg-white">
                                    {o.items?.map((it, idx) => (
                                      <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-stone-50/50">
                                        <div className="flex items-center gap-2.5">
                                          {it.image ? (
                                            <div className="w-11 h-11 rounded-lg bg-stone-50 border border-stone-200 p-0.5 flex-shrink-0 flex items-center justify-center">
                                              <img src={it.image} alt={it.name} className="w-full h-full object-contain" />
                                            </div>
                                          ) : (
                                            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 text-[#b38531] flex items-center justify-center font-bold">
                                              {idx + 1}
                                            </div>
                                          )}
                                          <div>
                                            <div className="font-bold text-stone-900 font-serif">{it.name}</div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                                              <span className="font-bold text-[#b38531] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px] uppercase">
                                                {it.size || '100ML'}
                                              </span>
                                              <span>•</span>
                                              <span>Rs. {Number(it.price).toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="text-right">
                                          <div className="text-stone-400 text-[11px]">Qty: {it.qty}</div>
                                          <div className="font-bold text-stone-900 text-xs">
                                            Rs. {(Number(it.price) * (it.qty || 1)).toLocaleString()}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* 3. Payment & Financial Summary */}
                                <div className="bg-amber-50/40 border border-amber-200/90 rounded-xl p-4 space-y-3">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                                    Financial Summary & Payment
                                  </span>

                                  <div className="space-y-1.5 text-xs text-stone-600">
                                    <div className="flex justify-between">
                                      <span>Items Subtotal:</span>
                                      <span className="font-semibold text-stone-800">
                                        Rs. {Number(o.subtotal || o.total).toLocaleString()}
                                      </span>
                                    </div>

                                    {o.discount > 0 && (
                                      <div className="flex justify-between text-emerald-700 font-semibold">
                                        <span>Discount {o.couponCode ? `(${o.couponCode})` : ''}:</span>
                                        <span>- Rs. {Number(o.discount).toLocaleString()}</span>
                                      </div>
                                    )}

                                    <div className="flex justify-between">
                                      <span>Express Courier:</span>
                                      <span className="font-semibold text-stone-800">
                                        {o.shipping === 0 ? 'FREE' : `Rs. ${o.shipping}`}
                                      </span>
                                    </div>

                                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-amber-200">
                                      <span>Grand Total:</span>
                                      <span className="text-base text-[#b38531] font-serif">
                                        Rs. {Number(o.total).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between text-xs">
                                    <span className="text-stone-500 text-[11px]">Payment Mode:</span>
                                    <span className="font-bold text-stone-800 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-amber-200">
                                      <Banknote className="w-3.5 h-3.5 text-[#b38531]" />
                                      <span>{o.payment || 'Cash on Delivery'}</span>
                                    </span>
                                  </div>

                                  {/* Quick Status inside dropdown */}
                                  <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-bold text-stone-600">Current Status:</span>
                                    <select
                                      value={o.status || 'Pending'}
                                      onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                      className="text-xs font-bold rounded-lg px-2.5 py-1 bg-white border border-stone-300 text-stone-800 cursor-pointer focus:outline-none focus:border-[#b38531]"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
