import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Trash2,
  DollarSign
} from 'lucide-react';
import { Quotation, EventBooking, BookingItem } from '../../types';
import { StorageService } from '../../services/storage';

interface QuotationsInvoicesViewProps {
  onRefresh: () => void;
  onOpenPrint?: (docType: 'quote' | 'invoice', data: any) => void;
}

export const QuotationsInvoicesView: React.FC<QuotationsInvoicesViewProps> = ({
  onRefresh,
  onOpenPrint
}) => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [viewQuote, setViewQuote] = useState<Quotation | null>(null);

  const quotes = StorageService.getQuotations();
  const bookings = StorageService.getBookings();
  const rentalCatalog = StorageService.getRentalItems();

  // New quote state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventStartDate, setEventStartDate] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0]
  );
  const [setupDaysPrior, setSetupDaysPrior] = useState(3);
  const [dismantleDaysAfter, setDismantleDaysAfter] = useState(3);
  const [items, setItems] = useState<BookingItem[]>([]);
  const [transportCrewFee, setTransportCrewFee] = useState(20000);
  const [securityDeposit, setSecurityDeposit] = useState(25000);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('Quotation valid for 7 days. 30% advance required to confirm booking and lock stock.');

  // Item line adder for quote
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemQty, setSelectedItemQty] = useState(1);

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const cat = rentalCatalog.find(i => i.id === selectedItemId);
    if (!cat) return;

    // Calculate active days
    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);
    const days = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    setItems([
      ...items,
      {
        itemId: cat.id,
        name: cat.name,
        quantity: selectedItemQty,
        dailyRate: cat.dailyRate,
        totalDays: days,
        subtotal: cat.dailyRate * selectedItemQty * days
      }
    ]);
    setSelectedItemId('');
    setSelectedItemQty(1);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(i => i.itemId !== itemId));
  };

  const equipmentTotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const grandTotal = equipmentTotal + Number(transportCrewFee) + Number(securityDeposit) - Number(discount);

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.length === 0) {
      alert('Please fill customer details and add at least one line item.');
      return;
    }

    const quoteNum = `LSL-QTE-2026-${String(quotes.length + 1).padStart(3, '0')}`;
    const newQuote: Quotation = {
      id: `qte-${Date.now()}`,
      quoteNumber: quoteNum,
      customerName,
      customerPhone,
      customerAddress,
      eventTitle,
      eventVenue,
      eventStartDate,
      eventEndDate,
      setupDaysPrior,
      dismantleDaysAfter,
      items,
      equipmentTotal,
      transportCrewFee: Number(transportCrewFee),
      securityDeposit: Number(securityDeposit),
      discount: Number(discount),
      grandTotal,
      status: 'Sent',
      notes,
      validUntil: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    StorageService.addQuotation(newQuote);
    setIsNewQuoteModalOpen(false);
    onRefresh();
  };

  // PDF 2.5: ONE-CLICK CONVERSION FROM QUOTE TO CONFIRMED BOOKING
  const handleConvertToBooking = (quote: Quotation) => {
    if (!window.confirm(`Convert Quotation ${quote.quoteNumber} to a Confirmed Event Booking? This will lock equipment stock and activate multi-stage date blocking.`)) {
      return;
    }

    // Compute blocked dates
    const start = new Date(quote.eventStartDate);
    const end = new Date(quote.eventEndDate);
    const bStart = new Date(start);
    bStart.setDate(bStart.getDate() - quote.setupDaysPrior);
    const bEnd = new Date(end);
    bEnd.setDate(bEnd.getDate() + quote.dismantleDaysAfter);

    const bookingNum = `LSL-EVT-2026-${String(bookings.length + 1).padStart(3, '0')}`;
    const convertedBooking: EventBooking = {
      id: `evt-${Date.now()}`,
      bookingNumber: bookingNum,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      customerAddress: quote.customerAddress,
      eventTitle: quote.eventTitle,
      eventVenue: quote.eventVenue,
      eventStartDate: quote.eventStartDate,
      eventEndDate: quote.eventEndDate,
      activeEventDays: Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1),
      setupDaysPrior: quote.setupDaysPrior,
      dismantleDaysAfter: quote.dismantleDaysAfter,
      blockedStartDate: bStart.toISOString().split('T')[0],
      blockedEndDate: bEnd.toISOString().split('T')[0],
      status: 'Confirmed',
      items: quote.items,
      equipmentTotal: quote.equipmentTotal,
      transportCrewFee: quote.transportCrewFee,
      securityDeposit: quote.securityDeposit,
      discount: quote.discount,
      netTotal: quote.grandTotal,
      advancePaid: 0,
      balanceDue: quote.grandTotal,
      notes: `Converted from Quotation ${quote.quoteNumber}. ${quote.notes || ''}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Update quotation status
    const updatedQuote: Quotation = {
      ...quote,
      status: 'Converted',
      convertedBookingId: convertedBooking.id
    };

    StorageService.addBooking(convertedBooking);
    StorageService.updateQuotation(updatedQuote);
    if (viewQuote?.id === quote.id) setViewQuote(updatedQuote);
    alert(`Success! Quotation converted to Booking ${bookingNum}. Stock is now locked across setup, event, and dismantling dates.`);
    onRefresh();
  };

  const filteredQuotes = quotes.filter(q =>
    q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Quotations & Invoices Engine</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              PDF Section 2.5
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sinhala">
            ප්‍රවීණ Quotation සහ Commercial Invoice සකස් කිරීම, Print කිරීම සහ ක්ලික් එකකින් Booking බවට හැරවීම
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'quotes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Quotations ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'invoices' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Commercial Invoices ({bookings.length})
            </button>
          </div>

          {activeTab === 'quotes' && (
            <button
              onClick={() => setIsNewQuoteModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quotation</span>
            </button>
          )}
        </div>
      </div>

      {/* Quotations View */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {q.quoteNumber}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      q.status === 'Converted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {q.status === 'Converted' ? 'Converted to Booking' : q.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{q.eventTitle}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>👤 {q.customerName}</span>
                    <span>📞 {q.customerPhone}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    📍 {q.eventVenue} • Dates: {q.eventStartDate} to {q.eventEndDate}
                  </div>

                  <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="text-slate-400 mb-1 font-semibold">Items Quoted:</div>
                    <div className="space-y-1">
                      {q.items.map(i => (
                        <div key={i.itemId} className="flex justify-between text-slate-300">
                          <span>{i.name} (x{i.quantity})</span>
                          <span className="font-mono">Rs. {i.subtotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Total Quote Amount</div>
                    <div className="text-lg font-black text-amber-400">
                      Rs. {q.grandTotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.status !== 'Converted' && (
                      <button
                        onClick={() => handleConvertToBooking(q)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Convert to Booking</span>
                      </button>
                    )}
                    {onOpenPrint && (
                      <button
                        onClick={() => onOpenPrint('quote', q)}
                        title="Print Professional Quotation"
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
        </div>
      )}

      {/* Invoices View */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice / Booking #</th>
                <th className="py-3 px-4">Customer & Event</th>
                <th className="py-3 px-4">Event Dates</th>
                <th className="py-3 px-4 text-right">Contract Total</th>
                <th className="py-3 px-4 text-right">Advance Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    INV-{b.bookingNumber.replace('LSL-EVT-', '')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{b.customerName}</div>
                    <div className="text-[11px] text-slate-400">{b.eventTitle} • {b.eventVenue}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {b.eventStartDate} ➜ {b.eventEndDate}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    Rs. {b.netTotal.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                    Rs. {b.advancePaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    Rs. {b.balanceDue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {onOpenPrint && (
                      <button
                        onClick={() => onOpenPrint('invoice', b)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs transition flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Quotation Creator Modal */}
      {isNewQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Quotation</h3>
              <button onClick={() => setIsNewQuoteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dilshan Wickramasinghe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="077 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Occasion / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pirith Mandapaya Lighting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Temple Grounds, Kelaniya"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Start Date</label>
                  <input
                    type="date"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event End Date</label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Add item to quotation */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-8">
                    <label className="block text-slate-300 mb-1">Select Equipment Item</label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    >
                      <option value="">-- Choose Item --</option>
                      {rentalCatalog.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Rs. {item.dailyRate.toLocaleString()}/day)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-300 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedItemQty}
                      onChange={(e) => setSelectedItemQty(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-1.5 rounded-lg"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="border border-slate-800 rounded-lg overflow-hidden mt-2">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-slate-400">
                        <tr>
                          <th className="p-2">Item</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2 text-right">Daily Rate</th>
                          <th className="p-2 text-right">Subtotal</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {items.map(item => (
                          <tr key={item.itemId}>
                            <td className="p-2 text-white">{item.name}</td>
                            <td className="p-2 text-center font-bold text-amber-400">{item.quantity}</td>
                            <td className="p-2 text-right">Rs. {item.dailyRate.toLocaleString()}</td>
                            <td className="p-2 text-right font-bold text-white">Rs. {item.subtotal.toLocaleString()}</td>
                            <td className="p-2 text-center">
                              <button type="button" onClick={() => removeItem(item.itemId)} className="text-rose-400">
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

              {/* Financials */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">Transport & Crew</label>
                  <input
                    type="number"
                    value={transportCrewFee}
                    onChange={(e) => setTransportCrewFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Security Deposit</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Discount</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Quotation Value:</span>
                <span className="text-xl font-black text-amber-400">Rs. {grandTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewQuoteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="px-4 py-1.5 rounded-lg text-slate-950 bg-amber-500 font-bold"
                >
                  Save & Print Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

