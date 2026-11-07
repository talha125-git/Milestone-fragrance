import React from 'react';

export default function MessagesTab({
  messages = [],
  setMessages,
  showToast,
}) {
  const handleToggleReplied = (msg) => {
    const updatedReplied = !msg.replied;
    setMessages((prev) =>
      prev.map((item) =>
        item.id === msg.id ? { ...item, replied: updatedReplied } : item
      )
    );

    fetch(`/api/contact/${msg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replied: updatedReplied }),
    }).catch(() => {});

    if (showToast) showToast('Message status updated');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
        <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
          Customer Inquiries & Messages ({messages.length})
        </h3>
        <p className="text-xs text-stone-500 mb-5">
          Submitted through the live Contact Us page.
        </p>

        <div className="space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-stone-900 text-sm">{m.name}</span>
                  <span className="text-xs text-stone-500 ml-2">&lt;{m.email}&gt;</span>
                  {m.phone && <span className="text-xs text-stone-500 ml-2">Phone: {m.phone}</span>}
                </div>
                <span className="text-[11px] text-stone-400">
                  {m.receivedAt ? new Date(m.receivedAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              <div className="text-xs font-bold text-[#b38531]">{m.subject}</div>
              <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-lg border border-stone-200/60">
                "{m.message}"
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200/60">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    m.replied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {m.replied ? 'Replied' : 'Pending Response'}
                </span>

                <button
                  onClick={() => handleToggleReplied(m)}
                  className="text-xs text-[#b38531] font-semibold hover:underline cursor-pointer"
                >
                  {m.replied ? 'Mark as Unread' : 'Mark as Replied'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

