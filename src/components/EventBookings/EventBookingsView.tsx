import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Trash2,
  Printer,
  ChevronRight,
  ShieldCheck,
  Calendar,
  X,
  ArrowRight,
  Boxes
} from 'lucide-react';
import { EventBooking, BookingItem, RentalItem, BookingStatus } from '../../types';
import { StorageService } from '../../services/storage';

interface EventBookingsViewProps {
  onRefresh: () => void;
  onOpenPrint?: (docType: 'invoice', data: any) => void;
  selectedBookingId?: string | null;
}

export const EventBookingsView: React.FC<EventBookingsViewProps> = ({
  onRefresh,
  onOpenPrint,
  selectedBookingId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState<EventBooking | null>(null);

  const bookings = StorageService.getBookings();
  const rentalCatalog = StorageService.getRentalItems();

  React.useEffect(() => {
    if (selectedBookingId) {
      const found = bookings.find(b => b.id === selectedBookingId);
      if (found) setViewBooking(found);
    }
  }, [selectedBookingId, bookings]);

  const today = new Date().toISOString().split('T')[0];

  const computeBlockedDates = (startDate: string, endDate: string, setupDays: number, dismantleDays: number) => {
    if (!startDate || !endDate) return { blockedStart: '', blockedEnd: '', activeDays: 1 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const bStart = new Date(start);
    bStart.setDate(bStart.getDate() - setupDays);
    
    const bEnd = new Date(end);
    bEnd.setDate(bEnd.getDate() + dismantleDays);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const activeDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    return {
      blockedStart: bStart.toISOString().split('T')[0],
      blockedEnd: bEnd.toISOString().split('T')[0],
      activeDays
    };
  };

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  
  const defaultStart = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0];
  const [eventStartDate, setEventStartDate] = useState(defaultStart);
  const [eventEndDate, setEventEndDate] = useState(defaultEnd);
  const [setupDaysPrior, setSetupDaysPrior] = useState<number>(3);
  const [dismantleDaysAfter, setDismantleDaysAfter] = useState<number>(3);

  const [selectedItems, setSelectedItems] = useState<BookingItem[]>([]);
  const [transportFee, setTransportFee] = useState<number>(25000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(30000);
  const [discount, setDiscount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const [itemToAddId, setItemToAddId] = useState('');
  const [itemToAddQty, setItemToAddQty] = useState(1);

  const computedWindow = useMemo(() => {
    return computeBlockedDates(eventStartDate, eventEndDate, setupDaysPrior, dismantleDaysAfter);
  }, [eventStartDate, eventEndDate, setupDaysPrior, dismantleDaysAfter]);

  const currentItemAvailability = useMemo(() => {
    if (!itemToAddId || !computedWindow.blockedStart || !computedWindow.blockedEnd) return null;
    return StorageService.checkItemAvailability(
      itemToAddId,
      computedWindow.blockedStart,
      computedWindow.blockedEnd,
      itemToAddQty
    );
  }, [itemToAddId, itemToAddQty, computedWindow]);

  const handleAddItemToBooking = () => {
    if (!itemToAddId || itemToAddQty <= 0) return;
    const catItem = rentalCatalog.find(i => i.id === itemToAddId);
    if (!catItem) return;

    const existingIndex = selectedItems.findIndex(i => i.itemId === itemToAddId);
    const lineTotal = catItem.dailyRate * itemToAddQty * computedWindow.activeDays;

    if (existingIndex >= 0) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += itemToAddQty;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * catItem.dailyRate * computedWindow.activeDays;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          itemId: catItem.id,
          name: catItem.name,
          quantity: itemToAddQty,
          dailyRate: catItem.dailyRate,
          totalDays: computedWindow.activeDays,
          subtotal: lineTotal
        }
      ]);
    }

    setItemToAddId('');
    setItemToAddQty(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.itemId !== itemId));
  };

  const equipmentTotal = selectedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const netTotal = equipmentTotal + Number(transportFee) + Number(securityDeposit) - Number(discount);
  const balanceDue = Math.max(0, netTotal - Number(advancePaid));

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventTitle || selectedItems.length === 0) {
      alert('Please fill customer details and add at least one rental item.');
      return;
    }

    const bookingNum = `LSL-EVT-2026-${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking: EventBooking = {
      id: `evt-${Date.now()}`,
      bookingNumber: bookingNum,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      eventTitle,
      eventVenue,
      eventStartDate,
      eventEndDate,
      activeEventDays: computedWindow.activeDays,
      setupDaysPrior,
      dismantleDaysAfter,
      blockedStartDate: computedWindow.blockedStart,
      blockedEndDate: computedWindow.blockedEnd,
      status: 'Confirmed',
      items: selectedItems,
      equipmentTotal,
      transportCrewFee: Number(transportFee),
      securityDeposit: Number(securityDeposit),
      discount: Number(discount),
      netTotal,
      advancePaid: Number(advancePaid),
      balanceDue,
      notes,
      createdAt: today
    };

    StorageService.addBooking(newBooking);
    setIsNewBookingModalOpen(false);
    resetForm();
    onRefresh();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setEventTitle('');
    setEventVenue('');
    setSelectedItems([]);
    setAdvancePaid(0);
    setDiscount(0);
    setNotes('');
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
      const updated = { ...b, status: newStatus };
      StorageService.updateBooking(updated);
      setViewBooking(updated);
      onRefresh();
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventVenue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Event Bookings & Date Blocking</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory locking across pre-event setup (3–4 days), active show dates, and post-event dismantling (3 days)
          </p>
        </div>

        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Stage Booking</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search booking number, venue, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Confirmed', 'In-Setup', 'Active-Event', 'Dismantling', 'Completed', 'Quote'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List Cards */}
      <div className="space-y-3">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {b.bookingNumber}
                </span>
                <h3 className="text-base font-bold text-white">
                  {b.eventTitle}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  b.status === 'Confirmed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : b.status === 'In-Setup'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : b.status === 'Completed'
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {b.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Customer: <strong>{b.customerName}</strong></span>
                <span>Tel: {b.customerPhone}</span>
                <span>Venue: {b.eventVenue}</span>
              </div>

              {/* Lifecycle Date Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-300">
                  <div className="text-[10px] uppercase font-bold text-amber-400">
                    1. Setup ({b.setupDaysPrior} Days Prior)
                  </div>
                  <div>{b.blockedStartDate} ➜ {b.eventStartDate}</div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-emerald-300">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">
                    2. Event ({b.activeEventDays} Active Days)
                  </div>
                  <div>{b.eventStartDate} ➜ {b.eventEndDate}</div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 p-2 rounded-lg text-purple-300">
                  <div className="text-[10px] uppercase font-bold text-purple-400">
                    3. Dismantle ({b.dismantleDaysAfter} Days After)
                  </div>
                  <div>{b.eventEndDate} ➜ {b.blockedEndDate}</div>
                </div>
              </div>
            </div>

            {/* Financial summary & Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0 gap-2">
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400">Total Contract</div>
                <div className="text-lg font-black text-amber-400">
                  Rs. {b.netTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  Advance: Rs. {b.advancePaid.toLocaleString()} | Due: <strong className="text-rose-400">Rs. {b.balanceDue.toLocaleString()}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewBooking(b)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                >
                  View Details
                </button>
                {onOpenPrint && (
                  <button
                    onClick={() => onOpenPrint('invoice', b)}
                    title="Print Commercial Invoice"
                    className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {viewBooking.bookingNumber}
                </span>
                <h3 className="text-xl font-bold text-white">{viewBooking.eventTitle}</h3>
              </div>
              <button onClick={() => setViewBooking(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Lifecycle Status:</span>
              <div className="flex items-center gap-2">
                {(['Confirmed', 'In-Setup', 'Active-Event', 'Dismantling', 'Completed'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(viewBooking.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      viewBooking.status === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Venue */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block font-medium">Customer Information:</span>
                <span className="font-bold text-slate-200 text-sm">{viewBooking.customerName}</span>
                <div className="text-slate-300 mt-0.5">Phone: {viewBooking.customerPhone}</div>
                {viewBooking.customerAddress && <div className="text-slate-400">Address: {viewBooking.customerAddress}</div>}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Event Location & Dates:</span>
                <span className="font-bold text-slate-200 text-sm">Venue: {viewBooking.eventVenue}</span>
                <div className="text-slate-300 mt-0.5">
                  Event: {viewBooking.eventStartDate} to {viewBooking.eventEndDate} ({viewBooking.activeEventDays} Days)
                </div>
                <div className="text-amber-400 font-mono mt-0.5">
                  Full Stock Lock: {viewBooking.blockedStartDate} to {viewBooking.blockedEndDate}
                </div>
              </div>
            </div>

            {/* Equipment Items Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Reserved Equipment Items (Stock Deducted)
              </h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Daily Rate</th>
                      <th className="py-2.5 px-3 text-center">Days</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {viewBooking.items.map((line) => (
                      <tr key={line.itemId} className="text-slate-200">
                        <td className="py-2.5 px-3 font-medium">{line.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-400">{line.quantity}</td>
                        <td className="py-2.5 px-3 text-right">Rs. {line.dailyRate.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center">{line.totalDays}</td>
                        <td className="py-2.5 px-3 text-right font-bold">Rs. {line.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div className="space-y-1 text-slate-400">
                <div>Transport & Crew Fee: Rs. {viewBooking.transportCrewFee.toLocaleString()}</div>
                <div>Refundable Security Deposit: Rs. {viewBooking.securityDeposit.toLocaleString()}</div>
                <div>Discount: Rs. {viewBooking.discount.toLocaleString()}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-slate-400">Net Contract Total</div>
                <div className="text-xl font-black text-amber-400">Rs. {viewBooking.netTotal.toLocaleString()}</div>
                <div className="text-slate-300">
                  Advance: Rs. {viewBooking.advancePaid.toLocaleString()} | <span className="text-rose-400 font-bold">Due: Rs. {viewBooking.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              {onOpenPrint && (
                <button
                  onClick={() => onOpenPrint('invoice', viewBooking)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Commercial Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Stage New Booking Creator Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Create Event Booking with Multi-Stage Date Blocking</span>
                </h3>
                <p className="text-xs text-amber-400">
                  Multi-stage reservation: Pre-Event Setup + Active Event Duration + Post-Event Dismantling
                </p>
              </div>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4">
              {/* Customer & Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Customer Information
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Organization Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Fernando"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="077 123 4567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="customer@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Billing / Physical Address</label>
                    <input
                      type="text"
                      placeholder="Customer address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Event Details & Venue
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Event Name / Occasion *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Wedding Reception, Corporate Gala, Concert"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Event Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Waters Edge Battaramulla, Shangri-La, Temple Grounds"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Special Crew & Electrical Notes</label>
                    <input
                      type="text"
                      placeholder="3-phase 63A required, outdoor waterproof setup, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date Lifecycle Settings */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Multi-Stage Date Lifecycle Setup</span>
                  </h4>
                  <span className="text-[11px] text-amber-300 font-mono">
                    Total Blocked Duration: {computedWindow.activeDays + setupDaysPrior + dismantleDaysAfter} Days
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Event Start Date *</label>
                    <input
                      type="date"
                      required
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Event End Date *</label>
                    <input
                      type="date"
                      required
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-300 mb-1">
                      Pre-Event Setup Window *
                    </label>
                    <select
                      value={setupDaysPrior}
                      onChange={(e) => setSetupDaysPrior(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none"
                    >
                      <option value={2}>2 Days Prior</option>
                      <option value={3}>3 Days Prior (Standard)</option>
                      <option value={4}>4 Days Prior (Large Rig)</option>
                      <option value={5}>5 Days Prior (Complex)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-300 mb-1">
                      Post-Event Dismantle Window *
                    </label>
                    <select
                      value={dismantleDaysAfter}
                      onChange={(e) => setDismantleDaysAfter(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-purple-300 focus:outline-none"
                    >
                      <option value={1}>1 Day Afterward</option>
                      <option value={2}>2 Days Afterward</option>
                      <option value={3}>3 Days Afterward (Standard)</option>
                      <option value={4}>4 Days Afterward</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2 font-mono">
                  <div>
                    <span className="text-amber-400 font-bold">TOTAL STOCK LOCK PERIOD:</span>{' '}
                    <span>{computedWindow.blockedStart}</span> ➜ <span>{computedWindow.blockedEnd}</span>
                  </div>
                  <div className="text-[11px] text-amber-300">
                    ({computedWindow.activeDays + setupDaysPrior + dismantleDaysAfter} total days reserved)
                  </div>
                </div>
              </div>

              {/* Equipment Items Selection & Overbooking Conflict Engine */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-amber-400" />
                    <span>Select Rental Equipment & Check Real-Time Availability</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Automated conflict & overbooking verification
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Select Item from Master Catalog
                    </label>
                    <select
                      value={itemToAddId}
                      onChange={(e) => setItemToAddId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Choose Equipment --</option>
                      {rentalCatalog.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Rate: Rs. {item.dailyRate.toLocaleString()}/day, Total Stock: {item.totalQuantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Quantity Needed
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={itemToAddQty}
                      onChange={(e) => setItemToAddQty(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      disabled={!itemToAddId || (currentItemAvailability && !currentItemAvailability.available)}
                      onClick={handleAddItemToBooking}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition shadow"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                {/* Overbooking Alert Banner if Conflict Detected */}
                {currentItemAvailability && (
                  <div className={`p-2.5 rounded-lg text-xs border ${
                    currentItemAvailability.available
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  }`}>
                    {currentItemAvailability.available ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Available for full lifecycle:</strong> {currentItemAvailability.availableQty} units free out of {currentItemAvailability.totalStock} net stock.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-rose-400">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>OVERBOOKING WARNING! Cannot reserve {itemToAddQty} units.</span>
                        </div>
                        <div className="text-[11px] text-rose-200/90 pl-6">
                          Only <strong>{currentItemAvailability.availableQty}</strong> units available during this blocked window.
                          {currentItemAvailability.conflictingBookings.length > 0 && (
                            <div className="mt-1 font-mono text-[10px]">
                              Conflicting bookings:{' '}
                              {currentItemAvailability.conflictingBookings.map(c => 
                                `${c.bookingNumber} (${c.customerName}: ${c.qty} units)`
                              ).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Items Table */}
                {selectedItems.length > 0 && (
                  <div className="border border-slate-800 rounded-lg overflow-hidden mt-3">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-400">
                        <tr>
                          <th className="py-2 px-3">Equipment</th>
                          <th className="py-2 px-3 text-center">Qty</th>
                          <th className="py-2 px-3 text-right">Daily Rate</th>
                          <th className="py-2 px-3 text-center">Active Days</th>
                          <th className="py-2 px-3 text-right">Subtotal</th>
                          <th className="py-2 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {selectedItems.map((item) => (
                          <tr key={item.itemId}>
                            <td className="py-2 px-3 text-white font-medium">{item.name}</td>
                            <td className="py-2 px-3 text-center text-amber-400 font-bold">{item.quantity}</td>
                            <td className="py-2 px-3 text-right">Rs. {item.dailyRate.toLocaleString()}</td>
                            <td className="py-2 px-3 text-center">{item.totalDays}</td>
                            <td className="py-2 px-3 text-right font-bold text-white">Rs. {item.subtotal.toLocaleString()}</td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.itemId)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Equipment Total (LKR)</label>
                    <input
                      type="text"
                      disabled
                      value={`Rs. ${equipmentTotal.toLocaleString()}`}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Transport & Crew Fee</label>
                    <input
                      type="number"
                      value={transportFee}
                      onChange={(e) => setTransportFee(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Refundable Deposit</label>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Discount (LKR)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-800 pt-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-400 mb-1">Advance Payment Received (LKR)</label>
                      <input
                        type="number"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(Number(e.target.value))}
                        className="bg-slate-900 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Net Amount</div>
                    <div className="text-2xl font-black text-amber-400">
                      Rs. {netTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      Balance Due: <strong className="text-rose-400">Rs. {balanceDue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedItems.length === 0}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  Confirm Booking & Lock Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
