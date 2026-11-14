import { RentalItem, RetailItem, EventBooking, Quotation, LightWalOrder, Employee, AttendanceRecord } from '../types';

// Clean initial production slate: all dummy data removed
export const initialRentalItems: RentalItem[] = [];
export const initialRetailItems: RetailItem[] = [];
export const initialBookings: EventBooking[] = [];
export const initialQuotations: Quotation[] = [];
export const initialLightWalOrders: LightWalOrder[] = [];
export const initialEmployees: Employee[] = [];
export const initialAttendanceRecords: AttendanceRecord[] = [];

// Optional starter equipment templates (can be loaded via Settings -> "Load Starter Equipment Catalog")
export const starterRentalItems: RentalItem[] = [
  {
    id: 'rent-01',
    name: 'Sharpy Beam 7R Moving Head 230W',
    category: 'Sharpy & Beams',
    totalQuantity: 24,
    maintenanceQty: 0,
    dailyRate: 3500,
    replacementCost: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60',
    specs: '230W 7R Osram lamp, 14 colors + open, 17 gobos, 8-facet rotating prism, DMX 512 control'
  },
  {
    id: 'rent-02',
    name: 'LED Par Light 54x3W RGBW Waterproof',
    category: 'Par Lights',
    totalQuantity: 60,
    maintenanceQty: 0,
    dailyRate: 850,
    replacementCost: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    specs: '54 pieces x 3W high brightness LEDs (RGBW 4-in-1), cast aluminum chassis, IP65 outdoor'
  },
  {
    id: 'rent-03',
    name: 'Aluminum Box Truss 10ft (300mm x 300mm)',
    category: 'Truss & Rigging',
    totalQuantity: 30,
    maintenanceQty: 0,
    dailyRate: 2000,
    replacementCost: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60',
    specs: 'Heavy duty 6082-T6 aircraft aluminum, spigot connection, 10ft standard segment'
  },
  {
    id: 'rent-04',
    name: 'Stage Blinder 4-Eye 400W COB LED',
    category: 'Effects & Lasers',
    totalQuantity: 12,
    maintenanceQty: 0,
    dailyRate: 2500,
    replacementCost: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
    specs: '4x100W Warm White COB LED with amber backlight aura, individual cell control'
  },
  {
    id: 'rent-05',
    name: '3-Phase Main Power Distro Box 63A with MCB',
    category: 'Power & Distro',
    totalQuantity: 8,
    maintenanceQty: 0,
    dailyRate: 4500,
    replacementCost: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60',
    specs: '63A 5-Pin inlet, 12x 16A Schuko/Universal outlets, digital voltage/amp meters, RCD protection'
  },
  {
    id: 'rent-06',
    name: 'Antari Professional DMX Haze Machine 1500W',
    category: 'Effects & Lasers',
    totalQuantity: 6,
    maintenanceQty: 0,
    dailyRate: 5000,
    replacementCost: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60',
    specs: 'Continuous haze output, whisper-quiet fan, oil-based long-hang fluid compatible'
  },
  {
    id: 'rent-07',
    name: 'Warm White Fairy / Festoon Light Canopy Set (500m)',
    category: 'Ambient & Decor',
    totalQuantity: 10,
    maintenanceQty: 0,
    dailyRate: 15000,
    replacementCost: 140000,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=60',
    specs: '500m total heavy rubber cable with 1,000 warm white 2W Edison vintage golf ball bulbs'
  },
  {
    id: 'rent-08',
    name: 'RGB Full-Color Animation Laser 5W Pure Diode',
    category: 'Effects & Lasers',
    totalQuantity: 4,
    maintenanceQty: 0,
    dailyRate: 7500,
    replacementCost: 165000,
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60',
    specs: '5W RGB Pure Diode, 30kpps scanners, ILDA / DMX 512, beam show & text projection'
  }
];

export const starterRetailItems: RetailItem[] = [
  {
    id: 'ret-01',
    sku: 'LSL-BULB-ED2W',
    name: 'E27 Warm White Edison LED Bulb 2W (Vintage Amber)',
    category: 'Bulbs & Lamps',
    unit: 'Piece',
    unitCost: 160,
    retailPrice: 280,
    stockQty: 100,
    minAlertQty: 20
  },
  {
    id: 'ret-02',
    sku: 'LSL-BULB-G40',
    name: 'G40 Clear Globe Festoon Bulb E12 / E27 1W',
    category: 'Bulbs & Lamps',
    unit: 'Piece',
    unitCost: 110,
    retailPrice: 220,
    stockQty: 150,
    minAlertQty: 30
  },
  {
    id: 'ret-03',
    sku: 'LSL-WIRE-2X15',
    name: '2-Core 1.5mm Heavy Duty Flat Rubber Wire (100m Coil)',
    category: 'Wires & Cables',
    unit: 'Roll',
    unitCost: 14500,
    retailPrice: 18500,
    stockQty: 10,
    minAlertQty: 3
  },
  {
    id: 'ret-04',
    sku: 'LSL-HLD-E27WP',
    name: 'E27 Waterproof Festoon Light Socket Holder with Rubber Seal',
    category: 'Holders & Sockets',
    unit: 'Piece',
    unitCost: 65,
    retailPrice: 120,
    stockQty: 200,
    minAlertQty: 50
  },
  {
    id: 'ret-05',
    sku: 'LSL-PLUG-13A',
    name: '13A British Standard Fused Heavy Duty Top Plug',
    category: 'Holders & Sockets',
    unit: 'Piece',
    unitCost: 220,
    retailPrice: 380,
    stockQty: 50,
    minAlertQty: 10
  },
  {
    id: 'ret-06',
    sku: 'LSL-TAPE-NITTO',
    name: 'High Grade Waterproof Electrical Insulation Tape (Pack of 10)',
    category: 'Tapes & Accessories',
    unit: 'Box',
    unitCost: 950,
    retailPrice: 1500,
    stockQty: 20,
    minAlertQty: 5
  },
  {
    id: 'ret-07',
    sku: 'LSL-CTRL-8F',
    name: 'Outdoor 8-Mode Waterproof Controller Box for String Lights 1000W',
    category: 'Power Supplies',
    unit: 'Piece',
    unitCost: 1400,
    retailPrice: 2600,
    stockQty: 15,
    minAlertQty: 5
  }
];
