import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Tag,
  Eye,
  X
} from 'lucide-react';
import { RentalItem, EventBooking } from '../../types';
import { StorageService } from '../../services/storage';

interface RentalStockViewProps {
  onRefresh: () => void;
}

export const RentalStockView: React.FC<RentalStockViewProps> = ({ onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState<RentalItem | null>(null);

  const rentalItems = StorageService.getRentalItems();
  const bookings = StorageService.getBookings();
  const usageStats = StorageService.getCurrentRentalUsage();

  const categories = [
    'All',
    'Sharpy & Beams',
    'Par Lights',
    'Truss & Rigging',
    'Effects & Lasers',
    'Power & Distro',
    'Ambient & Decor'
  ];

  const filteredItems = rentalItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [newItem, setNewItem] = useState<Partial<RentalItem>>({
    name: '',
    category: 'Sharpy & Beams',
    totalQuantity: 10,
    maintenanceQty: 0,
    dailyRate: 2500,
    replacementCost: 50000,
    specs: ''
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.dailyRate) return;

    const created: RentalItem = {
      id: `rent-${Date.now()}`,
      name: newItem.name || '',
      category: newItem.category as any,
      totalQuantity: Number(newItem.totalQuantity) || 1,
      maintenanceQty: Number(newItem.maintenanceQty) || 0,
      dailyRate: Number(newItem.dailyRate) || 0,
      replacementCost: Number(newItem.replacementCost) || 0,
      specs: newItem.specs || '',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60'
    };

    StorageService.addRentalItem(created);
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      category: 'Sharpy & Beams',
      totalQuantity: 10,
      maintenanceQty: 0,
      dailyRate: 2500,
      replacementCost: 50000,
      specs: ''
    });
    onRefresh();
  };

  const getBookingsForItem = (itemId: string) => {
    return bookings.filter(b => 
      b.status !== 'Cancelled' &&
      b.status !== 'Completed' &&
      b.items.some(line => line.itemId === itemId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Rental Equipment Master Catalog</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              SRS Section 2.1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master inventory management with real-time automatic stock deduction upon booking
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search lights, trusses, generators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const stats = usageStats.find(s => s.item.id === item.id);
          const currentlyBooked = stats?.currentlyBooked || 0;
          const freeStock = stats?.freeStock || (item.totalQuantity - item.maintenanceQty);
          const itemBookings = getBookingsForItem(item.id);

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col transition shadow-md"
            >
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      Rs. {item.dailyRate.toLocaleString()} <span className="text-slate-400 font-normal">/day</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {item.name}
                  </h3>

                  {item.specs && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {item.specs}
                    </p>
                  )}
                </div>

                {/* Stock Breakdown Card */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Total Stock</div>
                      <div className="font-extrabold text-white text-sm">{item.totalQuantity}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <div className="text-amber-400 text-[10px]">Reserved</div>
                      <div className="font-extrabold text-amber-400 text-sm">{currentlyBooked}</div>
                    </div>
                    <div className={`p-2 rounded-lg border ${
                      freeStock === 0
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      <div className="text-[10px]">Available</div>
                      <div className="font-extrabold text-sm">{freeStock}</div>
                    </div>
                  </div>

                  {item.maintenanceQty > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{item.maintenanceQty} units in maintenance / repair</span>
                    </div>
                  )}

                  <button
                    onClick={() => setInspectItem(item)}
                    className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Booking Schedule ({itemBookings.length})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Item Schedule Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Reserved Dates: {inspectItem.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  All active events and multi-stage date blocking intervals holding this equipment
                </p>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {getBookingsForItem(inspectItem.id).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No active or upcoming bookings holding this item right now.
                </div>
              ) : (
                getBookingsForItem(inspectItem.id).map(b => {
                  const line = b.items.find(l => l.itemId === inspectItem.id);
                  return (
                    <div
                      key={b.id}
                      className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs text-amber-400 font-bold mr-2">
                            {b.bookingNumber}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {b.eventTitle}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                          {line?.quantity} units locked
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="bg-amber-500/10 text-amber-300 p-1.5 rounded">
                          <div className="text-[9px] uppercase font-bold">Setup Window</div>
                          <div>{b.blockedStartDate} ➜ {b.eventStartDate}</div>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-300 p-1.5 rounded">
                          <div className="text-[9px] uppercase font-bold">Event Window</div>
                          <div>{b.eventStartDate} ➜ {b.eventEndDate}</div>
                        </div>
                        <div className="bg-purple-500/10 text-purple-300 p-1.5 rounded">
                          <div className="text-[9px] uppercase font-bold">Dismantle Window</div>
                          <div>{b.eventEndDate} ➜ {b.blockedEndDate}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-right pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Equipment Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Rental Equipment</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beam 260 Moving Head"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sharpy & Beams">Sharpy & Beams</option>
                    <option value="Par Lights">Par Lights</option>
                    <option value="Truss & Rigging">Truss & Rigging</option>
                    <option value="Effects & Lasers">Effects & Lasers</option>
                    <option value="Power & Distro">Power & Distro</option>
                    <option value="Ambient & Decor">Ambient & Decor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Daily Rental Rate (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItem.dailyRate}
                    onChange={(e) => setNewItem({ ...newItem, dailyRate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Quantity in Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newItem.totalQuantity}
                    onChange={(e) => setNewItem({ ...newItem, totalQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Replacement Value (LKR)
                  </label>
                  <input
                    type="number"
                    value={newItem.replacementCost}
                    onChange={(e) => setNewItem({ ...newItem, replacementCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technical Specifications / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Power rating, DMX channels, lamp type..."
                  value={newItem.specs}
                  onChange={(e) => setNewItem({ ...newItem, specs: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
