import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, ArrowUpRight, LogOut } from 'lucide-react';
import { logo } from '../../assets';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  navItems = [],
  onLogout,
}) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('milestone_admin_auth');
    localStorage.removeItem('milestone_admin_user');
    sessionStorage.removeItem('milestone_admin_auth');
    sessionStorage.removeItem('milestone_admin_user');
    if (onLogout) onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Left Sidebar Navigation (Blackish Luxury Theme #14120f) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#14120f] border-r border-[#262019] text-stone-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-[#241e17] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Milestone Fragrances" className="h-8 w-auto object-contain" />
              <div>
                <span className="text-[10px] font-bold text-[#dfb76c] tracking-[0.2em] uppercase block">
                  Admin Console
                </span>
                <span className="text-xs font-serif font-bold text-white">
                  Milestone Fragrance
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#dfb76c] text-[#0d0c0a] font-bold shadow-md shadow-[#dfb76c]/15'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0d0c0a]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-black'
                          : 'bg-white/10 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Live store link & Admin User Card */}
        <div className="p-3 border-t border-[#241e17] space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#dfb76c] hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Live Storefront</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <div className="p-2.5 rounded-xl bg-[#1b1713] border border-[#2c241b] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#dfb76c] text-[#0d0c0a] font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">admin</div>
                <div className="text-[10px] text-[#dfb76c]">Super Administrator</div>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

