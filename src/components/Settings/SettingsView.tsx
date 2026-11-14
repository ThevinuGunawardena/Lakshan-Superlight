import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Building,
  CreditCard,
  FileText
} from 'lucide-react';
import { StorageService, CompanyInfo } from '../../services/storage';

interface SettingsViewProps {
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefresh }) => {
  const [company, setCompany] = useState<CompanyInfo>(StorageService.getCompanyInfo());
  const [savedSuccess, setSavedSuccess] = useState(false);

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
        onRefresh();
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
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
