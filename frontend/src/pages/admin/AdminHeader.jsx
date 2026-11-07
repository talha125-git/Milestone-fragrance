import React from 'react';
import { Menu, RefreshCw, Plus } from 'lucide-react';

export default function AdminHeader({
  activeTab,
  setSidebarOpen,
  loadAllRealData,
  isRefreshing,
  onOpenAddModal,
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Overview';
      case 'products':
        return 'Fragrance Inventory & Catalog';
      case 'orders':
        return 'Customer Orders & Shipments';
      case 'messages':
        return 'Inquiries & Customer Care';
      case 'newsletter':
        return 'VIP Newsletter Subscribers';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
            {getTabTitle()}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block">
            Milestone Fragrance official administrative dashboard.
          </p>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={loadAllRealData}
          disabled={isRefreshing}
          title="Refresh Real Data"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#b38531]' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Fragrance</span>
        </button>
      </div>
    </header>
  );
}

