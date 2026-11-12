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
} from 'lucide-react';

export default function OrdersTab({
  orders = [],
  handleOrderStatusChange,
  handleDeleteOrder,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
              Live customer orders from checkout with dynamic sizes, address & courier dispatch details.
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

      {/* Orders Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">Order Ref & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Purchased Fragrance(s)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#b38531] font-mono">{o.id}</div>
                      <div className="text-[10px] text-stone-400">{o.date || 'Recent'}</div>
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
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status || 'Pending'}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer border ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : o.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : o.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : o.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          title="View complete customer & shipping details"
                          className="p-1.5 text-stone-500 hover:text-[#b38531] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {handleDeleteOrder && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(o.id)}
                            title="Delete order"
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-6 text-stone-900">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Order Details: {selectedOrder.id}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        selectedOrder.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : selectedOrder.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : selectedOrder.status === 'Processing'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : selectedOrder.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">Placed on {selectedOrder.date}</p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Customer Information
                  </span>
                  <p className="text-sm font-bold text-stone-900">{selectedOrder.customer}</p>
                  <p className="flex items-center gap-1.5 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[#b38531] font-semibold">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.phone}</span>
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Delivery Address
                  </span>
                  <p className="font-semibold text-stone-800">{selectedOrder.address || 'Standard Address'}</p>
                  <p className="text-stone-600">
                    {selectedOrder.city} {selectedOrder.postalCode ? `(${selectedOrder.postalCode})` : ''}
                  </p>
                  {selectedOrder.notes && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-500">
                      <strong>Delivery Note:</strong> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchased Items */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Purchased Fragrances
                </span>
                <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {it.image && (
                          <div className="w-10 h-10 rounded bg-stone-100 p-1 flex-shrink-0 flex items-center justify-center">
                            <img src={it.image} alt={it.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900">{it.name}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-2">
                            <span className="font-bold text-[#b38531]">{it.size || '100ML'}</span>
                            <span>•</span>
                            <span>Unit: Rs. {Number(it.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-stone-500 text-[11px]">Qty: {it.qty}</div>
                        <div className="font-bold text-stone-900">
                          Rs. {(Number(it.price) * it.qty).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total Breakdown */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>Rs. {Number(selectedOrder.subtotal || selectedOrder.total).toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                    <span>- Rs. {Number(selectedOrder.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Courier Delivery:</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : `Rs. ${selectedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-amber-200">
                  <span>Total Order Amount:</span>
                  <span className="text-base text-[#b38531]">Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  Payment Method: <strong className="text-stone-800">{selectedOrder.payment}</strong>
                </div>
              </div>

              {/* Status Update & Close */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-stone-700">Update Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleOrderStatusChange(selectedOrder.id, newStatus);
                      setSelectedOrder((o) => ({ ...o, status: newStatus }));
                    }}
                    className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
