import React, { useState, useEffect } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  CalendarPlus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface HeaderProps {
  onQuickAction: (action: 'new-booking' | 'new-light-wal' | 'new-pos' | 'punch-attendance') => void;
  onDataChanged: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickAction, onDataChanged, theme = 'light', onToggleTheme }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleExportBackup = () => {
    const json = StorageService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lakshan_Superlight_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('System database exported successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default specifications? Any added test records will be refreshed.')) {
      StorageService.resetToDefaults();
      onDataChanged();
      showNotification('System demo data reset to default successfully!');
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 no-print">
      {/* Date & Live Clock */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
          <img src={theme === 'light' ? './logo-icon.svg' : './logo-icon-dark.svg'} alt="LS" className="w-4 h-4 object-contain" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Lakshan Super Light</span>
          <span className="text-[10px] text-red-600 font-semibold">(Pvt) Ltd</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">{timeStr}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 dark:text-slate-400">{dateStr}</span>
        </div>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition font-medium shadow-sm"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-slate-700 font-semibold text-[11px]">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline text-slate-300 font-semibold text-[11px]">Dark Mode</span>
              </>
            )}
          </button>
        )}

        {toast && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onQuickAction('new-booking')}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>New Booking</span>
        </button>

        <button
          onClick={() => onQuickAction('new-light-wal')}
          className="flex items-center gap-1.5 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-500/40 text-amber-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>"Light Wal" Invoice</span>
        </button>

        <button
          onClick={() => onQuickAction('new-pos')}
          className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick POS Sale</span>
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        <button
          onClick={handleExportBackup}
          title="Backup / Export JSON Data"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition hover:text-white"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          title="Reset to Initial Sample Data"
          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

