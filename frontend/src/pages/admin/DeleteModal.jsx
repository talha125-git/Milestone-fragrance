import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteModal({
  candidate,
  onClose,
  onConfirm,
}) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 text-stone-900 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-900 text-center mb-2">
            Delete "{candidate.name}"?
          </h3>
          <p className="text-xs text-stone-500 text-center mb-6">
            Are you sure you want to remove this perfume from the store catalog? This will unlist it from the storefront.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

