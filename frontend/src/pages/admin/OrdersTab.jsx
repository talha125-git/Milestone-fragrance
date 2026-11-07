import React from 'react';
import { MapPin } from 'lucide-react';

export default function OrdersTab({
  orders = [],
  handleOrderStatusChange,
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              All Customer Orders ({orders.length})
            </h3>
            <p className="text-xs text-stone-500">
              Real-time order entries with customer contact details and delivery tracking.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Fragrance Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#b38531]">{o.id}</div>
                    <div className="text-[10px] text-stone-400">{o.date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{o.customer}</div>
                    <div className="text-[11px] text-stone-500">{o.email}</div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{o.city}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {o.items?.map((it, idx) => (
                      <div key={idx} className="font-medium text-stone-800">
                        {it.qty}x {it.name} <span className="text-[11px] text-stone-400">({it.size})</span>
                      </div>
                    ))}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 text-sm">
                      Rs. {Number(o.total).toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 font-medium">{o.payment}</td>

                  <td className="py-3.5 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                      className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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

