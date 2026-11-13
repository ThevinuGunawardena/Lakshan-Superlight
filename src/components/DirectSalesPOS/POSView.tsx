import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Send,
  CheckCircle2,
  Package,
  Layers,
  History,
  AlertTriangle,
  X
} from 'lucide-react';
import { RetailItem, POSCartItem, POSTransaction } from '../../types';
import { StorageService } from '../../services/storage';

interface POSViewProps {
  onRefresh: () => void;
  onOpenPrint?: (docType: 'pos-receipt', data: any) => void;
}

export const POSView: React.FC<POSViewProps> = ({ onRefresh, onOpenPrint }) => {
  const [subTab, setSubTab] = useState<'pos' | 'inventory' | 'history'>('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const retailItems = StorageService.getRetailItems();
  const transactions = StorageService.getPOSTransactions();

  // POS Cart State
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Bank Transfer'>('Cash');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);

  // New retail item modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRetailItem, setNewRetailItem] = useState<Partial<RetailItem>>({
    sku: '',
    name: '',
    sinhalaName: '',
    category: 'Bulbs & Lamps',
    unit: 'Piece',
    unitCost: 150,
    retailPrice: 250,
    stockQty: 50,
    minAlertQty: 10
  });

  const categories = [
    'All',
    'Bulbs & Lamps',
    'Wires & Cables',
    'Holders & Sockets',
    'Tapes & Accessories',
    'Power Supplies'
  ];

  const filteredItems = retailItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sinhalaName && item.sinhalaName.includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (item: RetailItem) => {
    if (item.stockQty <= 0) {
      alert('This item is currently out of stock.');
      return;
    }

    const existingIndex = cart.findIndex(c => c.itemId === item.id);
    if (existingIndex >= 0) {
      const existing = cart[existingIndex];
      if (existing.quantity >= item.stockQty) {
        alert(`Cannot add more than available retail stock (${item.stockQty}).`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].lineTotal = updated[existingIndex].quantity * item.retailPrice;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          itemId: item.id,
          sku: item.sku,
          name: item.name,
          unit: item.unit,
          retailPrice: item.retailPrice,
          quantity: 1,
          lineDiscount: 0,
          lineTotal: item.retailPrice
        }
      ]);
    }
  };

  const updateCartQty = (itemId: string, delta: number) => {
    const item = retailItems.find(i => i.id === itemId);
    const updated = cart.map(line => {
      if (line.itemId === itemId) {
        const newQty = line.quantity + delta;
        if (newQty <= 0) return null;
        if (item && newQty > item.stockQty) {
          alert(`Max stock available: ${item.stockQty}`);
          return line;
        }
        return {
          ...line,
          quantity: newQty,
          lineTotal: newQty * line.retailPrice
        };
      }
      return line;
    }).filter(Boolean) as POSCartItem[];
    setCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.itemId !== itemId));
  };

  // Cart totals
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const netTotal = Math.max(0, subtotal - Number(overallDiscount));
  const changeDue = Math.max(0, Number(cashGiven) - netTotal);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Cash' && cashGiven < netTotal) {
      alert(`Received cash (Rs. ${cashGiven}) is less than total amount (Rs. ${netTotal}).`);
      return;
    }

    const receiptNum = `LSL-POS-${String(transactions.length + 1042)}`;
    const tx: POSTransaction = {
      id: `pos-${Date.now()}`,
      receiptNumber: receiptNum,
      date: new Date().toISOString(),
      customerName: customerName || 'Cash Customer',
      customerPhone,
      items: cart,
      subtotal,
      discount: Number(overallDiscount),
      netTotal,
      amountPaid: paymentMethod === 'Cash' ? Number(cashGiven) : netTotal,
      changeGiven: paymentMethod === 'Cash' ? changeDue : 0,
      paymentMethod,
      cashierName: 'Lakshan (Cashier)'
    };

    StorageService.recordPOSSale(tx);

    // Open print receipt modal if available
    if (onOpenPrint) {
      onOpenPrint('pos-receipt', tx);
    }

    // Reset cart
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCashGiven(0);
    setOverallDiscount(0);
    onRefresh();
  };

  const handleCreateRetailItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetailItem.name || !newRetailItem.retailPrice) return;

    const sku = newRetailItem.sku || `LSL-RET-${Date.now().toString().slice(-4)}`;
    const created: RetailItem = {
      id: `ret-${Date.now()}`,
      sku,
      name: newRetailItem.name || '',
      sinhalaName: newRetailItem.sinhalaName || '',
      category: newRetailItem.category as any,
      unit: newRetailItem.unit as any,
      unitCost: Number(newRetailItem.unitCost) || 0,
      retailPrice: Number(newRetailItem.retailPrice) || 0,
      stockQty: Number(newRetailItem.stockQty) || 0,
      minAlertQty: Number(newRetailItem.minAlertQty) || 5
    };

    const current = StorageService.getRetailItems();
    current.unshift(created);
    StorageService.saveRetailItems(current);
    setIsAddModalOpen(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Standalone Direct Sales (POS) Module</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              PDF Section 2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sinhala">
            කුලියට දෙන බඩු වලින් වෙන්වූ, කෙලින්ම සිල්ලරට විකුණන බඩු සඳහාම වෙන්වූ POS පද්ධතිය
          </p>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('pos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'pos'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>POS Register</span>
          </button>
          <button
            onClick={() => setSubTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Retail Stock ({retailItems.length})</span>
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              subTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Sales History ({transactions.length})</span>
          </button>
        </div>
      </div>

      {subTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center: Retail Product Catalog */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter bar */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search bulbs, wire, tape..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
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

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-xl transition cursor-pointer flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{item.sku}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        item.stockQty <= item.minAlertQty
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.stockQty} in stock
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2 group-hover:text-amber-400 transition">
                      {item.name}
                    </h4>
                    {item.sinhalaName && (
                      <div className="text-[10px] text-slate-400 font-sinhala truncate mt-0.5">
                        {item.sinhalaName}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">
                      Rs. {item.retailPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      /{item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Checkout Register & Cart */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Current Cart ({cart.length} items)</span>
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Customer quick inputs */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <input
                  type="text"
                  placeholder="Customer Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
                <input
                  type="text"
                  placeholder="Phone (Optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              {/* Cart Table */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    Cart is empty. Click items on the left to add.
                  </div>
                ) : (
                  cart.map((line) => (
                    <div
                      key={line.itemId}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="font-semibold text-white truncate">{line.name}</div>
                        <div className="text-[11px] text-slate-400">
                          Rs. {line.retailPrice.toLocaleString()} × {line.quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-slate-900 rounded-md border border-slate-800">
                          <button
                            onClick={() => updateCartQty(line.itemId, -1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-amber-400">{line.quantity}</span>
                          <button
                            onClick={() => updateCartQty(line.itemId, 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-bold text-white w-16 text-right">
                          Rs. {line.lineTotal.toLocaleString()}
                        </div>

                        <button
                          onClick={() => removeFromCart(line.itemId)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calculations & Payment Methods */}
            <div className="border-t border-slate-800 pt-3 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Discount:</span>
                  <input
                    type="number"
                    min="0"
                    value={overallDiscount}
                    onChange={(e) => setOverallDiscount(Number(e.target.value))}
                    className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-right text-xs text-white"
                  />
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                  <span>Net Total:</span>
                  <span className="text-emerald-400 text-base font-black">
                    Rs. {netTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash', 'Card', 'Bank Transfer'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        paymentMethod === mode
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash given & change due */}
              {paymentMethod === 'Cash' && (
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Cash Received</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={cashGiven || ''}
                      onChange={(e) => setCashGiven(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Change Due</label>
                    <div className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-400 font-black">
                      Rs. {changeDue.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Checkout & Print Thermal Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Sub-tab */}
      {subTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Retail Stock Inventory</h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Retail Product</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-right">Retail Price</th>
                  <th className="py-3 px-4 text-center">Stock Qty</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {retailItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-amber-400">{item.sku}</td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{item.name}</div>
                      {item.sinhalaName && (
                        <div className="text-[10px] text-slate-400 font-sinhala">{item.sinhalaName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-right text-slate-400">Rs. {item.unitCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">Rs. {item.retailPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-200">
                      {item.stockQty} {item.unit}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.stockQty <= item.minAlertQty
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {item.stockQty <= item.minAlertQty ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Sub-tab */}
      {subTab === 'history' && (
        <div className="space-y-4">
          <h3 className="font-bold text-white text-base">Direct POS Sales History</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Sold</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Net Total</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      No POS sales recorded yet. Process a sale above.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{tx.receiptNumber}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(tx.date).toLocaleString()}</td>
                      <td className="py-3 px-4 text-white">{tx.customerName || 'Cash Customer'}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {tx.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-400 text-sm">
                        Rs. {tx.netTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {onOpenPrint && (
                          <button
                            onClick={() => onOpenPrint('pos-receipt', tx)}
                            className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Retail Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Retail POS Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRetailItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2.5mm Twin Flat Wire (100m)"
                  value={newRetailItem.name}
                  onChange={(e) => setNewRetailItem({ ...newRetailItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 font-sinhala">Product Name (Sinhala)</label>
                <input
                  type="text"
                  placeholder="උදා: 2.5mm ට්වින් ෆ්ලැට් වයර් රෝල්"
                  value={newRetailItem.sinhalaName}
                  onChange={(e) => setNewRetailItem({ ...newRetailItem, sinhalaName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newRetailItem.category}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="Bulbs & Lamps">Bulbs & Lamps</option>
                    <option value="Wires & Cables">Wires & Cables</option>
                    <option value="Holders & Sockets">Holders & Sockets</option>
                    <option value="Tapes & Accessories">Tapes & Accessories</option>
                    <option value="Power Supplies">Power Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                  <select
                    value={newRetailItem.unit}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, unit: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Roll">Roll</option>
                    <option value="Meter">Meter</option>
                    <option value="Box">Box</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cost Price (LKR)</label>
                  <input
                    type="number"
                    value={newRetailItem.unitCost}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, unitCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Retail Selling Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={newRetailItem.retailPrice}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, retailPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={newRetailItem.stockQty}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, stockQty: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Low Stock Alert Qty</label>
                  <input
                    type="number"
                    value={newRetailItem.minAlertQty}
                    onChange={(e) => setNewRetailItem({ ...newRetailItem, minAlertQty: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-slate-950 bg-amber-500 font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

