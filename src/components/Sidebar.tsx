import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Boxes,
  Sparkles,
  ShoppingBag,
  FileSpreadsheet,
  Fingerprint,
  Megaphone,
  Settings,
  Flame,
  ChevronRight
} from 'lucide-react';

export type TabType = 
  | 'dashboard'
  | 'bookings'
  | 'rental-stock'
  | 'light-wal'
  | 'direct-sales'
  | 'quotations'
  | 'payroll'
  | 'marketing'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  bookingBadgeCount?: number;
  lowStockCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  bookingBadgeCount = 0,
  lowStockCount = 0
}) => {
  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      subtitle: 'Overview & Metrics',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'bookings' as TabType,
      label: 'Event Bookings & Dates',
      subtitle: 'Multi-Stage Date Blocking',
      icon: CalendarDays,
      badge: bookingBadgeCount > 0 ? bookingBadgeCount : null,
      badgeColor: 'bg-amber-500 text-black',
      tag: 'SRS 2.1 & 2.2'
    },
    {
      id: 'rental-stock' as TabType,
      label: 'Rental Master Stock',
      subtitle: 'Real-Time Catalog',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : null,
      badgeColor: 'bg-rose-500 text-white',
      tag: 'SRS 2.1'
    },
    {
      id: 'light-wal' as TabType,
      label: 'Dedicated "Light Wal"',
      subtitle: 'Festoon & Fairy Lights',
      icon: Sparkles,
      badge: 'Dedicated',
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-500/30',
      tag: 'SRS 2.6'
    },
    {
      id: 'direct-sales' as TabType,
      label: 'Standalone Sales POS',
      subtitle: 'Direct Retail Sales',
      icon: ShoppingBag,
      badge: 'Retail',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      tag: 'SRS 2.4'
    },
    {
      id: 'quotations' as TabType,
      label: 'Quotes & Invoices',
      subtitle: 'Typing & Print Engine',
      icon: FileSpreadsheet,
      badge: null,
      tag: 'SRS 2.5'
    },
    {
      id: 'payroll' as TabType,
      label: 'Biometric & Payroll',
      subtitle: 'Attendance & Salaries',
      icon: Fingerprint,
      badge: null,
      tag: 'SRS 2.3'
    },
    {
      id: 'marketing' as TabType,
      label: 'Marketing & Leads',
      subtitle: 'WhatsApp Funnel & Maps',
      icon: Megaphone,
      badge: 'Phase 1',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      tag: 'Phase 1'
    },
    {
      id: 'settings' as TabType,
      label: 'Settings & Company',
      subtitle: 'Profile & Banking Terms',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 no-print select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
            <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>LAKSHAN</span>
              <span className="text-amber-400 font-black">SUPERLIGHT</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Event Productions & Rentals
            </p>
            <p className="text-[10px] text-amber-400/80 font-medium mt-1">
              Enterprise Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/15'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive ? 'text-slate-950 stroke-[2.2]' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-sm font-medium leading-snug truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-slate-900/80 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive ? 'bg-slate-950 text-amber-300' : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {!isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-medium">System Status</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Stock Date-Blocking & POS Engine v1.0
        </p>
      </div>
    </aside>
  );
};
