import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { RentalStockView } from './components/RentalStock/RentalStockView';
import { EventBookingsView } from './components/EventBookings/EventBookingsView';
import { LightWalView } from './components/LightWalModule/LightWalView';
import { POSView } from './components/DirectSalesPOS/POSView';
import { QuotationsInvoicesView } from './components/QuotationsInvoices/QuotationsInvoicesView';
import { BiometricPayrollView } from './components/BiometricPayroll/BiometricPayrollView';
import { MarketingHubView } from './components/MarketingHub/MarketingHubView';
import { SettingsView } from './components/Settings/SettingsView';
import { PrintModal } from './components/Common/PrintModal';
import { StorageService } from './services/storage';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    const validTabs: TabType[] = ['dashboard', 'bookings', 'rental-stock', 'light-wal', 'direct-sales', 'quotations', 'payroll', 'marketing', 'settings'];
    if (tabParam && validTabs.includes(tabParam)) {
      return tabParam;
    }
    return 'dashboard';
  });
  const [dataVersion, setDataVersion] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleSelectTab = (tab: TabType) => {
    setSelectedBookingId(null);
    setCurrentTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  // Theme management: defaults to 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('lsl_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('lsl_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Print Modal State
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    docType: 'invoice' | 'quote' | 'light-wal' | 'pos-receipt' | 'payslip';
    data: any;
  }>({
    isOpen: false,
    docType: 'invoice',
    data: null
  });

  const handleRefreshData = () => {
    setDataVersion(v => v + 1);
  };

  const handleOpenPrint = (docType: 'invoice' | 'quote' | 'light-wal' | 'pos-receipt' | 'payslip', data: any) => {
    setPrintModalState({
      isOpen: true,
      docType,
      data
    });
  };

  const handleClosePrint = () => {
    setPrintModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleQuickAction = (action: 'new-booking' | 'new-light-wal' | 'new-pos' | 'punch-attendance') => {
    if (action === 'new-booking') {
      setCurrentTab('bookings');
    } else if (action === 'new-light-wal') {
      setCurrentTab('light-wal');
    } else if (action === 'new-pos') {
      setCurrentTab('direct-sales');
    } else if (action === 'punch-attendance') {
      setCurrentTab('payroll');
    }
  };

  const handleOpenBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCurrentTab('bookings');
  };

  // Badge counts
  const bookings = StorageService.getBookings();
  const retailItems = StorageService.getRetailItems();
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In-Setup' || b.status === 'Active-Event').length;
  const lowStockCount = retailItems.filter(i => i.stockQty <= i.minAlertQty).length;

  return (
    <div className={`flex min-h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900 light-theme' : 'bg-slate-950 text-slate-100'}`}>
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        bookingBadgeCount={activeBookingsCount}
        lowStockCount={lowStockCount}
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onQuickAction={handleQuickAction}
          onDataChanged={handleRefreshData}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={handleSelectTab}
              onOpenBooking={handleOpenBooking}
            />
          )}

          {currentTab === 'bookings' && (
            <EventBookingsView
              key={`bookings-${dataVersion}`}
              onRefresh={handleRefreshData}
              onOpenPrint={handleOpenPrint}
              selectedBookingId={selectedBookingId}
            />
          )}

          {currentTab === 'rental-stock' && (
            <RentalStockView
              key={`rental-${dataVersion}`}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'light-wal' && (
            <LightWalView
              key={`light-wal-${dataVersion}`}
              onRefresh={handleRefreshData}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentTab === 'direct-sales' && (
            <POSView
              key={`pos-${dataVersion}`}
              onRefresh={handleRefreshData}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentTab === 'quotations' && (
            <QuotationsInvoicesView
              key={`quotes-${dataVersion}`}
              onRefresh={handleRefreshData}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentTab === 'payroll' && (
            <BiometricPayrollView
              key={`payroll-${dataVersion}`}
              onRefresh={handleRefreshData}
              onOpenPrint={handleOpenPrint}
            />
          )}

          {currentTab === 'marketing' && (
            <MarketingHubView />
          )}

          {currentTab === 'settings' && (
            <SettingsView onRefresh={handleRefreshData} />
          )}
        </main>
      </div>

      {/* Universal Print Modal */}
      <PrintModal
        isOpen={printModalState.isOpen}
        onClose={handleClosePrint}
        docType={printModalState.docType}
        data={printModalState.data}
      />
    </div>
  );
}
export default App;

