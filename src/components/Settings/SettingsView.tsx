import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  CreditCard,
  FileText,
  Database,
  RefreshCw,
  ExternalLink,
  Trash2,
  Sparkles,
  Boxes
} from 'lucide-react';
import { StorageService, CompanyInfo } from '../../services/storage';
import { getStoredSupabaseConfig, resetSupabaseClient, testSupabaseConnection } from '../../services/supabaseClient';
import { CloudSyncService } from '../../services/cloudSync';

interface SettingsViewProps {
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefresh }) => {
  const [company, setCompany] = useState<CompanyInfo>(StorageService.getCompanyInfo());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Cloud database config
  const initialCloud = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCloud.url);
  const [supabaseKey, setSupabaseKey] = useState(initialCloud.key);
  const [isCloudReady, setIsCloudReady] = useState(initialCloud.isConfigured);
  const [cloudTesting, setCloudTesting] = useState(false);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  const handleTestConnection = async () => {
    setCloudTesting(true);
    setCloudStatusMsg(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setCloudStatusMsg(res);
    setCloudTesting(false);
  };

  const handleSaveCloudConfig = async () => {
    resetSupabaseClient(supabaseUrl, supabaseKey);
    const updated = getStoredSupabaseConfig();
    setIsCloudReady(updated.isConfigured);
    setCloudStatusMsg({ success: true, message: 'Cloud database credentials saved successfully!' });
    setTimeout(() => setCloudStatusMsg(null), 4000);
  };

  const handlePushToCloud = async () => {
    setCloudSyncing(true);
    setCloudStatusMsg(null);
    const res = await CloudSyncService.pushToCloud();
    setCloudStatusMsg(res);
    setCloudSyncing(false);
  };

  const handlePullFromCloud = async () => {
    setCloudSyncing(true);
    setCloudStatusMsg(null);
    const res = await CloudSyncService.pullFromCloud();
    if (res.success) {
      setCloudStatusMsg({ success: true, message: `Successfully pulled ${res.count} records from cloud database!` });
      onRefresh();
    } else {
      setCloudStatusMsg({ success: false, message: res.error || 'Failed to pull cloud records.' });
    }
    setCloudSyncing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveCompanyInfo(company);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleExport = () => {
    const json = StorageService.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lakshan_Superlight_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.rentalItems) StorageService.saveRentalItems(data.rentalItems);
        if (data.retailItems) StorageService.saveRetailItems(data.retailItems);
        if (data.bookings) StorageService.saveBookings(data.bookings);
        if (data.quotations) StorageService.saveQuotations(data.quotations);
        if (data.lightWalOrders) StorageService.saveLightWalOrders(data.lightWalOrders);
        if (data.employees) StorageService.saveEmployees(data.employees);
        if (data.attendance) StorageService.saveAttendance(data.attendance);
        if (data.payroll) StorageService.savePayroll(data.payroll);
        if (data.companyInfo) {
          StorageService.saveCompanyInfo(data.companyInfo);
          setCompany(data.companyInfo);
        }
        alert('Database restored successfully from backup!');
        setDataCounts(StorageService.getDataCounts());
        onRefresh();
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const [dataCounts, setDataCounts] = useState(StorageService.getDataCounts());

  const handleClearAllDummyData = () => {
    if (window.confirm('Clear all test bookings, quotations, light wal orders, staff roster, and attendance records?\n\n(Equipment inventory catalog will be preserved).')) {
      StorageService.clearAllDummyData();
      setDataCounts(StorageService.getDataCounts());
      onRefresh();
      alert('Test bookings, orders, quotes, and staff have been wiped clean!');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ TOTAL CLEAN SLATE: Are you sure you want to delete ALL data (inventory, equipment, bookings, orders, staff) to start from absolute zero?')) {
      StorageService.clearAllData();
      setDataCounts(StorageService.getDataCounts());
      onRefresh();
      alert('Total clean slate completed. All database tables are now at zero.');
    }
  };

  const handleLoadStarterCatalog = () => {
    if (window.confirm('Load standard professional stage lighting fleet & festoon retail supplies template?')) {
      const res = StorageService.loadStarterCatalog();
      setDataCounts(StorageService.getDataCounts());
      onRefresh();
      alert(`Loaded ${res.rentalCount} rental equipment items and ${res.retailCount} retail items!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">System Settings & Company Profile</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure company branding, commercial bank account details, and default contractual terms
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Company profile updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-red-500" />
            <span>Company Branding (Header on Invoices & Quotations)</span>
          </h3>

          {/* Official Brand Logo Preview & Downloads */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Print / Light Media Logo</span>
              <img src="./logo.svg" alt="Lakshan Super Light Logo" className="h-12 w-auto object-contain" />
              <div className="flex gap-2 mt-1">
                <a href="./logo.svg" download="Lakshan-Superlight-Logo.svg" className="text-[10px] text-red-600 hover:underline font-semibold">Download SVG</a>
                <span className="text-slate-300">•</span>
                <a href="./logo.png" download="Lakshan-Superlight-Logo.png" className="text-[10px] text-slate-700 hover:underline font-semibold">PNG (High-Res)</a>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dark Theme / Header Logo</span>
              <img src="./logo-white.svg" alt="Lakshan Super Light Dark Logo" className="h-12 w-auto object-contain" />
              <div className="flex gap-2 mt-1">
                <a href="./logo-white.svg" download="Lakshan-Superlight-White.svg" className="text-[10px] text-red-400 hover:underline font-semibold">Download SVG</a>
                <span className="text-slate-600">•</span>
                <a href="./logo-white.png" download="Lakshan-Superlight-White.png" className="text-[10px] text-slate-300 hover:underline font-semibold">PNG</a>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Circular LS Monogram Badge</span>
              <img src="./logo-icon-dark.svg" alt="LS Monogram" className="h-12 w-12 object-contain" />
              <div className="flex gap-2 mt-1">
                <a href="./logo-icon.svg" download="LS-Monogram.svg" className="text-[10px] text-red-400 hover:underline font-semibold">Icon SVG</a>
                <span className="text-slate-600">•</span>
                <a href="./favicon.png" download="favicon.png" className="text-[10px] text-slate-300 hover:underline font-semibold">Favicon PNG</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline / Services Line</label>
              <input
                type="text"
                value={company.tagline}
                onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Registered Address</label>
            <input
              type="text"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Hotline</label>
              <input
                type="text"
                value={company.phone1}
                onChange={(e) => setCompany({ ...company, phone1: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Secondary Hotline</label>
              <input
                type="text"
                value={company.phone2}
                onChange={(e) => setCompany({ ...company, phone2: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Bank Account Details (Printed on Invoices for Direct Transfers)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
              <input
                type="text"
                value={company.bankName}
                onChange={(e) => setCompany({ ...company, bankName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Branch</label>
              <input
                type="text"
                value={company.bankBranch}
                onChange={(e) => setCompany({ ...company, bankBranch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Number</label>
              <input
                type="text"
                value={company.accountNumber}
                onChange={(e) => setCompany({ ...company, accountNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Holder Name</label>
              <input
                type="text"
                value={company.accountHolder}
                onChange={(e) => setCompany({ ...company, accountHolder: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Cloud Database & Multi-Device Synchronization (Supabase) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Cloud Database & Multi-Device Sync (Supabase PostgreSQL)</span>
            </h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isCloudReady
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCloudReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{isCloudReady ? 'Cloud Connected' : 'Local Storage Mode'}</span>
            </span>
          </div>

          <p className="text-slate-400 text-[11px]">
            Connect a free Supabase cloud database so when you host this website, bookings, stock deductions, and POS sales instantly synchronize across all office PCs, warehouse tablets, and mobile phones.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          {cloudStatusMsg && (
            <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
              cloudStatusMsg.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
            }`}>
              {cloudStatusMsg.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{cloudStatusMsg.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={cloudTesting}
              onClick={handleTestConnection}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1.5 border border-slate-700/60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudTesting ? 'animate-spin' : ''}`} />
              <span>{cloudTesting ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveCloudConfig}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Cloud Credentials</span>
            </button>

            {isCloudReady && (
              <>
                <button
                  type="button"
                  disabled={cloudSyncing}
                  onClick={handlePushToCloud}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{cloudSyncing ? 'Uploading...' : 'Push Local Data to Cloud'}</span>
                </button>

                <button
                  type="button"
                  disabled={cloudSyncing}
                  onClick={handlePullFromCloud}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-1.5 px-3.5 rounded-lg transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pull Cloud Data to Device</span>
                </button>
              </>
            )}
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Quick 3-Minute Setup:</div>
            <div>1. Create a free account at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-red-500 underline font-semibold">supabase.com</a> and click "New Project".</div>
            <div>2. Open the <strong>SQL Editor</strong> in Supabase, paste the contents of <code className="font-mono text-slate-300">supabase_schema.sql</code> (provided in this project), and click <strong>Run</strong>.</div>
            <div>3. Go to <strong>Project Settings ➜ API</strong>, copy your <strong>Project URL</strong> and <strong>anon public API key</strong> into the fields above, and click <strong>Save Cloud Credentials</strong>.</div>
          </div>
        </div>

        {/* Database Backup & Restore */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Database Backup & Data Portability</span>
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Full Database (.json)</span>
            </button>

            <label className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl transition flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import Database Backup</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Production Clean Slate & Data Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Production Data Management & Clean Slate</span>
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Manage live storage records, purge dummy test data, or load standard stage lighting catalog templates
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready for Production</span>
            </div>
          </div>

          {/* Current Database Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Event Bookings</div>
              <div className="text-base font-black text-amber-400">{dataCounts.bookings}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Rental Equipment</div>
              <div className="text-base font-black text-blue-400">{dataCounts.rentalItems}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Retail Supplies</div>
              <div className="text-base font-black text-emerald-400">{dataCounts.retailItems}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Light Wal Orders</div>
              <div className="text-base font-black text-purple-400">{dataCounts.lightWalOrders}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Quotations</div>
              <div className="text-base font-black text-cyan-400">{dataCounts.quotations}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Staff Members</div>
              <div className="text-base font-black text-pink-400">{dataCounts.employees}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Attendance Logs</div>
              <div className="text-base font-black text-slate-300">{dataCounts.attendance}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">POS Sales</div>
              <div className="text-base font-black text-emerald-300">{dataCounts.posTransactions}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClearAllData}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold py-2 px-3.5 rounded-xl transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Wipe Entire Database (Total Clean Slate)</span>
            </button>

            <button
              type="button"
              onClick={handleClearAllDummyData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2 px-3.5 rounded-xl transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Wipe Test Bookings & Staff Only</span>
            </button>

            <button
              type="button"
              onClick={handleLoadStarterCatalog}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2 px-3.5 rounded-xl transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Load Starter Equipment Catalog</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
