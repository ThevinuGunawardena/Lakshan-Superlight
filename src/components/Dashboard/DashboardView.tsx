import React from 'react';
import {
  CalendarDays,
  ShoppingBag,
  Sparkles,
  Users,
  Boxes,
  ArrowUpRight,
  Clock,
  AlertCircle,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { TabType } from '../Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenBooking: (bookingId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenBooking }) => {
  const bookings = StorageService.getBookings();
  const rentalStockUsage = StorageService.getCurrentRentalUsage();
  const retailItems = StorageService.getRetailItems();
  const lightWalOrders = StorageService.getLightWalOrders();
  const posTransactions = StorageService.getPOSTransactions();
  const attendance = StorageService.getAttendance();

  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In-Setup' || b.status === 'Active-Event');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === todayStr);

  const todayPOSTotal = posTransactions
    .filter(t => t.date.startsWith(todayStr))
    .reduce((sum, t) => sum + t.netTotal, 0);

  const totalGearBooked = rentalStockUsage.reduce((acc, curr) => acc + curr.currentlyBooked, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Specs Notification */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Lifecycle Date Blocking Engine Active</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Lakshan Superlight Operations Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Automatic inventory deduction across <span className="text-amber-400 font-semibold">Pre-Event Setup (3–4 days)</span>, <span className="text-emerald-400 font-semibold">Active Event</span>, and <span className="text-purple-400 font-semibold">Post-Event Dismantling (3 days)</span> to prevent overbooking.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('bookings')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage Bookings & Dates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Event Bookings */}
        <div
          onClick={() => onNavigate('bookings')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Event Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{activeBookings.length}</span>
            <span className="text-xs text-amber-400/80 font-medium">({bookings.length} total)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Active and confirmed bookings
          </p>
        </div>

        {/* Card 2: Rental Gear Currently Locked/Out */}
        <div
          onClick={() => onNavigate('rental-stock')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gear Currently Blocked</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalGearBooked}</span>
            <span className="text-xs text-slate-400">units reserved</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Locked in active date windows
          </p>
        </div>

        {/* Card 3: Direct Sales POS Today */}
        <div
          onClick={() => onNavigate('direct-sales')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's POS Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">
              Rs. {todayPOSTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Retail direct sales revenue
          </p>
        </div>

        {/* Card 4: Staff Present Today */}
        <div
          onClick={() => onNavigate('payroll')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-4 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Biometric Clock-ins</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{todayAttendance.length}</span>
            <span className="text-xs text-purple-400/80 font-medium">staff on duty</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Verified fingerprint check-ins
          </p>
        </div>
      </div>

      {/* Main Lifecycle Visualizer: SRS 2.2 Date Blocking Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Full-Lifecycle Event Date Blocking Timeline
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                SRS Section 2.2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated multi-stage item reservation across pre-event setup, active event dates, and post-event dismantling
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Setup Window (3–4 Days)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Active Event Days
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-medium">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              Dismantling Window (3 Days)
            </span>
          </div>
        </div>

        {/* Event Schedule Cards */}
        <div className="space-y-3">
          {bookings.map((booking) => {
            return (
              <div
                key={booking.id}
                onClick={() => onOpenBooking(booking.id)}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        {booking.bookingNumber}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {booking.eventTitle}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        booking.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Customer: {booking.customerName}</span>
                      <span>Venue: {booking.eventVenue}</span>
                      <span>Tel: {booking.customerPhone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Contract Value</div>
                    <div className="text-sm font-bold text-amber-400">
                      Rs. {booking.netTotal.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Multi-stage Lifecycle Progress Bar */}
                <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Stage 1: Pre-event setup */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pre-Event Setup ({booking.setupDaysPrior} Days)</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          {booking.blockedStartDate} ➜ {booking.eventStartDate}
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-300/80 font-medium">Installation</span>
                    </div>

                    {/* Stage 2: Active event */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Event ({booking.activeEventDays} Days)</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          {booking.eventStartDate} ➜ {booking.eventEndDate}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-300/80 font-medium">Show Dates</span>
                    </div>

                    {/* Stage 3: Post-event dismantling */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-md p-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          <span>Dismantling ({booking.dismantleDaysAfter} Days)</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          {booking.eventEndDate} ➜ {booking.blockedEndDate}
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-300/80 font-medium">Breakdown</span>
                    </div>
                  </div>

                  {/* Reserved Items summary pill */}
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-300">Locked Inventory:</span>
                    {booking.items.map((line) => (
                      <span
                        key={line.itemId}
                        className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700"
                      >
                        {line.name} × <strong className="text-amber-400">{line.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Current Stock Status & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Rental Stock Availability (SRS 2.1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Real-Time Rental Stock Status</span>
              </h3>
              <p className="text-xs text-slate-400">
                Available inventory vs. currently reserved units
              </p>
            </div>
            <button
              onClick={() => onNavigate('rental-stock')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {rentalStockUsage.slice(0, 5).map(({ item, total, currentlyBooked, freeStock }) => {
              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.category} • Rs. {item.dailyRate.toLocaleString()}/day
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        freeStock === 0
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : freeStock < 5
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {freeStock} Available
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({total} Total)
                      </span>
                    </div>
                    {currentlyBooked > 0 && (
                      <div className="text-[11px] text-amber-400/90 font-medium mt-0.5">
                        {currentlyBooked} locked in active bookings
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Modules Quick Access */}
        <div className="space-y-4">
          {/* Light Wal Highlight Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Dedicated Module • SRS 2.6</span>
              </span>
              <span className="text-xs text-slate-400">Festoon & Fairy Lights</span>
            </div>
            <h4 className="text-base font-bold text-white">
              "Light Wal" Invoicing & Workshop Engine
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Custom lengths (feet/meters), bulb counts, wire types (rubber/PVC), and bundle pricing with dedicated assembly job sheets.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {lightWalOrders.length} custom orders in system
              </span>
              <button
                onClick={() => onNavigate('light-wal')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
              >
                Open Light Wal Studio
              </button>
            </div>
          </div>

          {/* Standalone POS Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Standalone POS • SRS 2.4</span>
              </span>
              <span className="text-xs text-slate-400">Retail Sales</span>
            </div>
            <h4 className="text-base font-bold text-white">
              Direct Retail Sales & Thermal Billing
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Operates independently from rental stock. Handles retail bulbs, wires, rolls, sockets, and produces instant cash receipts.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {retailItems.length} retail items in catalog
              </span>
              <button
                onClick={() => onNavigate('direct-sales')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
              >
                Open Direct POS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
