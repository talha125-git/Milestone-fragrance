import React from 'react';
import { Trash2 } from 'lucide-react';

export default function NewsletterTab({
  subscribers = [],
  setSubscribers,
  showToast,
}) {
  const handleRemoveSubscriber = (email) => {
    setSubscribers((prev) => prev.filter((item) => item.email !== email));
    fetch(`/api/newsletter/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    }).catch(() => {});
    if (showToast) showToast(`Removed subscriber: ${email}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              VIP Newsletter Subscribers ({subscribers.length})
            </h3>
            <p className="text-xs text-stone-500">
              Real customer emails captured from the footer and newsletter sections.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3.5 px-4">Subscriber Email</th>
                <th className="py-3.5 px-4">Join Date</th>
                <th className="py-3.5 px-4">Subscription Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {subscribers.map((s, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{s.email}</td>
                  <td className="py-3.5 px-4 text-stone-500">{s.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {s.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRemoveSubscriber(s.email)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                      title="Remove Subscriber"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

