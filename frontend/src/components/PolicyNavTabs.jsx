import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, FileText, ChevronRight } from 'lucide-react';

export default function PolicyNavTabs({ activePolicy }) {
  const navigate = useNavigate();
  const location = useLocation();

  const policies = [
    {
      id: 'privacy',
      name: 'Privacy Policy',
      path: '/privacy-policy',
      icon: ShieldCheck,
      description: 'Data protection & security',
    },
    {
      id: 'shipping',
      name: 'Shipping Policy',
      path: '/shipping-policy',
      icon: Truck,
      description: 'Delivery times & rates',
    },
    {
      id: 'refund',
      name: 'Return & Refund',
      path: '/refund-policy',
      icon: RotateCcw,
      description: '7-day hassle-free guarantee',
    },
    {
      id: 'terms',
      name: 'Terms & Conditions',
      path: '/terms-and-conditions',
      icon: FileText,
      description: 'Store rules & service terms',
    },
  ];

  return (
    <div className="w-full mb-10 sm:mb-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 font-mono">
        <button
          onClick={() => navigate('/')}
          className="hover:text-[#dfb76c] transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-600" />
        <span className="text-stone-400">Customer Care & Policies</span>
        <ChevronRight className="w-3 h-3 text-stone-600" />
        <span className="text-[#dfb76c] font-semibold capitalize">
          {policies.find((p) => p.id === activePolicy)?.name || 'Legal Policy'}
        </span>
      </nav>

      {/* Policy Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#14120f] border border-[#262019] shadow-xl">
        {policies.map((policy) => {
          const Icon = policy.icon;
          const isActive = activePolicy === policy.id;
          return (
            <button
              key={policy.id}
              onClick={() => navigate(policy.path)}
              className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-r from-[#dfb76c] to-[#c99f52] text-[#0d0c0a] shadow-lg shadow-[#dfb76c]/15 font-semibold'
                  : 'bg-[#1a1714]/60 hover:bg-[#1f1c17] text-stone-300 hover:text-white border border-stone-800/60 hover:border-stone-700'
              }`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#0d0c0a] text-[#dfb76c]'
                    : 'bg-[#0d0c0a]/70 text-[#dfb76c] group-hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs sm:text-sm font-medium tracking-tight truncate ${
                    isActive ? 'text-[#0d0c0a] font-bold' : 'text-stone-200'
                  }`}
                >
                  {policy.name}
                </div>
                <div
                  className={`text-[10px] sm:text-[11px] truncate hidden xs:block ${
                    isActive ? 'text-[#0d0c0a]/80' : 'text-stone-400'
                  }`}
                >
                  {policy.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
