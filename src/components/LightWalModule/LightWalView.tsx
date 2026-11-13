import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Printer,
  Wrench,
  CheckCircle2,
  Package,
  Layers,
  HelpCircle,
  FileText,
  X,
  Search
} from 'lucide-react';
import { LightWalOrder } from '../../types';
import { StorageService } from '../../services/storage';

interface LightWalViewProps {
  onRefresh: () => void;
  onOpenPrint?: (docType: 'light-wal', data: any) => void;
}

export const LightWalView: React.FC<LightWalViewProps> = ({ onRefresh, onOpenPrint }) => {
  const orders = StorageService.getLightWalOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<LightWalOrder | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );

  const [lengthValue, setLengthValue] = useState<number>(100);
  const [lengthUnit, setLengthUnit] = useState<'Feet' | 'Meters'>('Feet');
  const [bulbSpacingInches, setBulbSpacingInches] = useState<number>(18);
  const [bulbType, setBulbType] = useState<LightWalOrder['bulbType']>('Warm White Edison 2W');
  const [wireType, setWireType] = useState<LightWalOrder['wireType']>('Heavy Duty Black Rubber 2x1.5mm');
  const [plugType, setPlugType] = useState<LightWalOrder['plugType']>('13A British Standard');
  const [controllerIncluded, setControllerIncluded] = useState<boolean>(true);
  const [controllerType, setControllerType] = useState<LightWalOrder['controllerType']>('8-Function Memory Controller');
  
  const [pricingMode, setPricingMode] = useState<'perFoot' | 'perBulb' | 'bundle'>('perFoot');
  const [ratePerUnit, setRatePerUnit] = useState<number>(220);
  const [accessoriesFee, setAccessoriesFee] = useState<number>(2500);
  const [discount, setDiscount] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(10000);
  const [workshopNotes, setWorkshopNotes] = useState('Include 5 spare bulbs in pack. Heavy duty waterproof heat shrink on ends.');

  const calculatedBulbCount = useMemo(() => {
    const totalInches = lengthUnit === 'Feet' ? lengthValue * 12 : lengthValue * 39.37;
    return Math.max(1, Math.round(totalInches / bulbSpacingInches));
  }, [lengthValue, lengthUnit, bulbSpacingInches]);

  const calculatedSubtotal = useMemo(() => {
    if (pricingMode === 'perFoot') {
      const feet = lengthUnit === 'Feet' ? lengthValue : Math.round(lengthValue * 3.28);
      return feet * ratePerUnit;
    } else if (pricingMode === 'perBulb') {
      return calculatedBulbCount * ratePerUnit;
    } else {
      return ratePerUnit;
    }
  }, [pricingMode, ratePerUnit, lengthValue, lengthUnit, calculatedBulbCount]);

  const grandTotal = Math.max(0, calculatedSubtotal + Number(accessoriesFee) - Number(discount));
  const balanceDue = Math.max(0, grandTotal - Number(advancePaid));

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter customer name and phone number.');
      return;
    }

    const orderNum = `LSL-LW-${String(orders.length + 84).padStart(3, '0')}`;
    const newOrder: LightWalOrder = {
      id: `lw-${Date.now()}`,
      orderNumber: orderNum,
      customerName,
      customerPhone,
      customerAddress,
      deliveryDate,
      lengthValue,
      lengthUnit,
      bulbSpacingInches,
      calculatedBulbCount,
      bulbType,
      wireType,
      plugType,
      controllerIncluded,
      controllerType: controllerIncluded ? controllerType : undefined,
      pricingMode,
      ratePerUnit,
      accessoriesFee: Number(accessoriesFee),
      discount: Number(discount),
      grandTotal,
      advancePaid: Number(advancePaid),
      balanceDue,
      status: 'Confirmed',
      workshopNotes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    StorageService.addLightWalOrder(newOrder);
    setIsModalOpen(false);
    resetForm();
    onRefresh();
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setLengthValue(100);
    setBulbSpacingInches(18);
    setRatePerUnit(220);
    setAccessoriesFee(2500);
    setDiscount(0);
    setAdvancePaid(10000);
  };

  const updateOrderStatus = (orderId: string, status: LightWalOrder['status']) => {
    const o = orders.find(x => x.id === orderId);
    if (o) {
      const updated = { ...o, status };
      StorageService.updateLightWalOrder(updated);
      if (viewOrder?.id === orderId) setViewOrder(updated);
      onRefresh();
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Dedicated "Light Wal" Invoicing Workflow</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              SRS Section 2.6
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated invoicing and workshop calculation for fairy and festoon light chains
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New "Light Wal" Order</span>
        </button>
      </div>

      {/* Quick Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="text-xs text-slate-400">
          Total Orders: <strong className="text-amber-400">{orders.length}</strong>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  {order.orderNumber}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  order.status === 'Ready for Pickup' || order.status === 'Delivered'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {order.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {order.customerName}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                <span>Tel: {order.customerPhone}</span>
                <span>Delivery: {order.deliveryDate}</span>
              </div>

              {/* Technical Spec Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Length & Bulbs:</span>
                  <span className="font-bold text-amber-400">
                    {order.lengthValue} {order.lengthUnit} • {order.calculatedBulbCount} Bulbs ({order.bulbSpacingInches}" spacing)
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Bulb Spec:</span>
                  <span>{order.bulbType}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Wire Type:</span>
                  <span className="truncate max-w-[200px]">{order.wireType}</span>
                </div>
                {order.controllerIncluded && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Controller:</span>
                    <span className="text-emerald-400 font-medium">{order.controllerType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial & Actions */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Price</div>
                <div className="text-lg font-black text-amber-400">
                  Rs. {order.grandTotal.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  Adv: Rs. {order.advancePaid.toLocaleString()} | Due: <strong className="text-rose-400">Rs. {order.balanceDue.toLocaleString()}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewOrder(order)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                >
                  View Spec
                </button>
                {onOpenPrint && (
                  <button
                    onClick={() => onOpenPrint('light-wal', order)}
                    title="Print Light Wal Invoice & Workshop Sheet"
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Light Wal Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {viewOrder.orderNumber}
                </span>
                <h3 className="text-lg font-bold text-white">Light Wal Workshop Job Sheet</h3>
              </div>
              <button onClick={() => setViewOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Changer */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Assembly Status:</span>
              <div className="flex items-center gap-1.5">
                {(['Confirmed', 'In Assembly', 'Ready for Pickup', 'Delivered'] as LightWalOrder['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(viewOrder.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      viewOrder.status === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Specifications for Assembly */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                Workshop Assembly Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>Length: <strong>{viewOrder.lengthValue} {viewOrder.lengthUnit}</strong></div>
                <div>Bulb Spacing: <strong>{viewOrder.bulbSpacingInches} Inches</strong></div>
                <div>Calculated Sockets: <strong className="text-amber-400">{viewOrder.calculatedBulbCount} Sockets</strong></div>
                <div>Bulb Type: <strong>{viewOrder.bulbType}</strong></div>
                <div>Cable Grade: <strong>{viewOrder.wireType}</strong></div>
                <div>Plug Spec: <strong>{viewOrder.plugType}</strong></div>
              </div>

              {viewOrder.workshopNotes && (
                <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                  <span className="text-amber-400 font-semibold">Special Instructions: </span>
                  {viewOrder.workshopNotes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              {onOpenPrint && (
                <button
                  onClick={() => onOpenPrint('light-wal', viewOrder)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print "Light Wal" Dedicated Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Light Wal Custom Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Dedicated "Light Wal" Calculation & Invoicing Engine</span>
                </h3>
                <p className="text-xs text-amber-400">
                  Configure custom chain length, bulb socket spacing, wire gauge, and pricing mode
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyantha Fernando"
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
                  <label className="block text-slate-300 font-semibold mb-1">Required Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Custom Sizing & Bulb Calculator</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Total Length *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="10"
                        value={lengthValue}
                        onChange={(e) => setLengthValue(Number(e.target.value))}
                        className="w-2/3 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                      />
                      <select
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value as any)}
                        className="w-1/3 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                      >
                        <option value="Feet">Feet</option>
                        <option value="Meters">Meters</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bulb Socket Spacing</label>
                    <select
                      value={bulbSpacingInches}
                      onChange={(e) => setBulbSpacingInches(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value={12}>12 Inches (1 ft - Dense)</option>
                      <option value={18}>18 Inches (1.5 ft - Standard)</option>
                      <option value={24}>24 Inches (2 ft - Economical)</option>
                      <option value={36}>36 Inches (3 ft - Wide)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Calculated Bulb Count</label>
                    <div className="bg-slate-900 border border-amber-500/40 rounded-lg px-3 py-1.5 text-amber-300 font-bold flex items-center justify-between">
                      <span>Total Sockets:</span>
                      <span className="text-sm font-black">{calculatedBulbCount} Bulbs</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Bulb Type & Color</label>
                    <select
                      value={bulbType}
                      onChange={(e) => setBulbType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="Warm White Edison 2W">Warm White Edison 2W (Vintage Filament)</option>
                      <option value="Clear Warm White LED 4W">Clear Warm White LED 4W (High Brightness)</option>
                      <option value="RGB Multi-Color Flashing">RGB Multi-Color Flashing</option>
                      <option value="Milky White G40">Milky White G40 Globe</option>
                      <option value="Vintage Filament Amber">Vintage Filament Amber Teardrop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Wire Grade & Insulation</label>
                    <select
                      value={wireType}
                      onChange={(e) => setWireType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="Heavy Duty Black Rubber 2x1.5mm">Heavy Duty Black Rubber 2x1.5mm (Outdoor Pro)</option>
                      <option value="Standard PVC Black 2-Core">Standard PVC Black 2-Core</option>
                      <option value="Outdoor Heavy 3-Core Grounded">Outdoor Heavy 3-Core Grounded</option>
                      <option value="Clear / Transparent Copper">Clear / Transparent Copper</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Top Plug Spec</label>
                    <select
                      value={plugType}
                      onChange={(e) => setPlugType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="13A British Standard">13A British Standard (Square Pin Fused)</option>
                      <option value="15A Round Pin">15A Round Pin Heavy Industrial</option>
                      <option value="Standard 2-Pin Plug">Standard 2-Pin Plug</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Flasher / Dimmer Controller</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={controllerIncluded}
                          onChange={(e) => setControllerIncluded(e.target.checked)}
                          className="rounded text-amber-500"
                        />
                        <span className="text-slate-300">Include</span>
                      </label>
                      {controllerIncluded && (
                        <select
                          value={controllerType}
                          onChange={(e) => setControllerType(e.target.value as any)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs"
                        >
                          <option value="8-Function Memory Controller">8-Function Memory Controller</option>
                          <option value="Inline Rotary Dimmer">Inline Rotary Dimmer</option>
                          <option value="Static Non-Flashing Driver">Static Non-Flashing Driver</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Modes (SRS 2.6: per length, bulb counts, or bundle pricing) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Pricing & Invoice Model
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPricingMode('perFoot'); setRatePerUnit(220); }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      pricingMode === 'perFoot'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold">Rate Per Foot/Meter</div>
                    <div className="text-[10px] opacity-80">e.g. Rs. 220 / foot</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPricingMode('perBulb'); setRatePerUnit(280); }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      pricingMode === 'perBulb'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold">Rate Per Bulb Socket</div>
                    <div className="text-[10px] opacity-80">e.g. Rs. 280 / socket</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPricingMode('bundle'); setRatePerUnit(35000); }}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      pricingMode === 'bundle'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold">Package / Bundle Price</div>
                    <div className="text-[10px] opacity-80">e.g. Rs. 35,000 package</div>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {pricingMode === 'perFoot' ? 'Rate / Foot (LKR)' : pricingMode === 'perBulb' ? 'Rate / Bulb (LKR)' : 'Bundle Package (LKR)'}
                    </label>
                    <input
                      type="number"
                      value={ratePerUnit}
                      onChange={(e) => setRatePerUnit(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Accessories & Spare Bulbs</label>
                    <input
                      type="number"
                      value={accessoriesFee}
                      onChange={(e) => setAccessoriesFee(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Special Discount</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Advance Deposit (LKR)</label>
                    <input
                      type="number"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-emerald-300 font-bold"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <div className="text-xs text-slate-400">
                    Workshop Line Total: Rs. {calculatedSubtotal.toLocaleString()}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Grand Total Amount</div>
                    <div className="text-xl font-black text-amber-400">
                      Rs. {grandTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      Balance Due: <strong className="text-rose-400">Rs. {balanceDue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Workshop Assembly Instructions / Packing Notes
                </label>
                <textarea
                  rows={2}
                  value={workshopNotes}
                  onChange={(e) => setWorkshopNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  Create Light Wal Order & Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
