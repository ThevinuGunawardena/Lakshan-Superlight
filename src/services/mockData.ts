import { RentalItem, RetailItem, EventBooking, Quotation, LightWalOrder, Employee, AttendanceRecord, PayrollRecord } from '../types';

export const initialRentalItems: RentalItem[] = [
  {
    id: 'rent-01',
    name: 'Sharpy Beam 7R Moving Head 230W',
    sinhalaName: 'ශාර්පි 7R මූවින් හෙඩ්ස්',
    category: 'Sharpy & Beams',
    totalQuantity: 24,
    maintenanceQty: 2,
    dailyRate: 3500,
    replacementCost: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60',
    specs: '230W 7R Osram lamp, 14 colors + open, 17 gobos, 8-facet rotating prism, DMX 512 control'
  },
  {
    id: 'rent-02',
    name: 'LED Par Light 54x3W RGBW Waterproof',
    sinhalaName: 'LED පාර් ලයිට් 54x3W',
    category: 'Par Lights',
    totalQuantity: 60,
    maintenanceQty: 4,
    dailyRate: 850,
    replacementCost: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60',
    specs: '54 pieces x 3W high brightness LEDs (RGBW 4-in-1), cast aluminum chassis, IP65 outdoor'
  },
  {
    id: 'rent-03',
    name: 'Aluminum Box Truss 10ft (300mm x 300mm)',
    sinhalaName: 'ඇලුමිනියම් ට්‍රස් 10ft',
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
    sinhalaName: 'බ්ලයින්ඩර් 4 Eye 400W',
    category: 'Effects & Lasers',
    totalQuantity: 12,
    maintenanceQty: 1,
    dailyRate: 2500,
    replacementCost: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60',
    specs: '4x100W Warm White COB LED with amber backlight aura, individual cell control'
  },
  {
    id: 'rent-05',
    name: '3-Phase Main Power Distro Box 63A with MCB',
    sinhalaName: 'පවර් ඩිස්ට්‍රිබියුෂන් බොක්ස් 63A',
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
    sinhalaName: 'හේස් දුම් මැෂින් 1500W',
    category: 'Effects & Lasers',
    totalQuantity: 6,
    maintenanceQty: 1,
    dailyRate: 5000,
    replacementCost: 110000,
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60',
    specs: 'Continuous haze output, whisper-quiet fan, oil-based long-hang fluid compatible'
  },
  {
    id: 'rent-07',
    name: 'Warm White Fairy / Festoon Light Canopy Set (500m)',
    sinhalaName: 'ෆෙස්ටූන් ලයිට් කැනපි සෙට් (500m)',
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
    sinhalaName: 'RGB ඇනිමේෂන් ලේසර් 5W',
    category: 'Effects & Lasers',
    totalQuantity: 4,
    maintenanceQty: 0,
    dailyRate: 7500,
    replacementCost: 165000,
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60',
    specs: '5W RGB Pure Diode, 30kpps scanners, ILDA / DMX 512, beam show & text projection'
  }
];

export const initialRetailItems: RetailItem[] = [
  {
    id: 'ret-01',
    sku: 'LSL-BULB-ED2W',
    name: 'E27 Warm White Edison LED Bulb 2W (Vintage Amber)',
    sinhalaName: 'E27 වෝම් වයිට් එඩිසන් බල්බ් 2W',
    category: 'Bulbs & Lamps',
    unit: 'Piece',
    unitCost: 160,
    retailPrice: 280,
    stockQty: 850,
    minAlertQty: 100
  },
  {
    id: 'ret-02',
    sku: 'LSL-BULB-G40',
    name: 'G40 Clear Globe Festoon Bulb E12 / E27 1W',
    sinhalaName: 'G40 ග්ලෝබ් බල්බ් 1W',
    category: 'Bulbs & Lamps',
    unit: 'Piece',
    unitCost: 110,
    retailPrice: 220,
    stockQty: 1200,
    minAlertQty: 200
  },
  {
    id: 'ret-03',
    sku: 'LSL-WIRE-2X15',
    name: 'Kelani / ACL 2-Core 1.5mm Heavy Duty Flat Rubber Wire (100m Coil)',
    sinhalaName: '2-Core 1.5mm රබර් වයර් රෝල් 100m',
    category: 'Wires & Cables',
    unit: 'Roll',
    unitCost: 14500,
    retailPrice: 18500,
    stockQty: 35,
    minAlertQty: 10
  },
  {
    id: 'ret-04',
    sku: 'LSL-HLD-E27WP',
    name: 'E27 Waterproof Festoon Light Socket Holder with Rubber Seal',
    sinhalaName: 'E27 වෝටර්පෲෆ් හෝල්ඩර්',
    category: 'Holders & Sockets',
    unit: 'Piece',
    unitCost: 65,
    retailPrice: 120,
    stockQty: 2400,
    minAlertQty: 300
  },
  {
    id: 'ret-05',
    sku: 'LSL-PLUG-13A',
    name: '13A British Standard Fused Heavy Duty Top Plug (Orange/Black)',
    sinhalaName: '13A හෙවි ඩියුටි ප්ලග් ටොප්',
    category: 'Holders & Sockets',
    unit: 'Piece',
    unitCost: 220,
    retailPrice: 380,
    stockQty: 180,
    minAlertQty: 40
  },
  {
    id: 'ret-06',
    sku: 'LSL-TAPE-NITTO',
    name: 'High Grade Waterproof Electrical Insulation Tape (Pack of 10)',
    sinhalaName: 'ඉන්සියුලේෂන් ටේප් පැක්',
    category: 'Tapes & Accessories',
    unit: 'Box',
    unitCost: 950,
    retailPrice: 1500,
    stockQty: 65,
    minAlertQty: 15
  },
  {
    id: 'ret-07',
    sku: 'LSL-CTRL-8F',
    name: 'Outdoor 8-Mode Waterproof Controller Box for String Lights 1000W',
    sinhalaName: 'වෝටර්පෲෆ් 8-මෝඩ් කන්ට්‍රෝලර් බොක්ස්',
    category: 'Power Supplies',
    unit: 'Piece',
    unitCost: 1400,
    retailPrice: 2600,
    stockQty: 42,
    minAlertQty: 8
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-01',
    empNo: 'EMP-001',
    name: 'Kavinda Perera',
    sinhalaName: 'කවින්ද පෙරේරා',
    role: 'Lead Electrician',
    phone: '077 123 4567',
    nationalId: '199214502840',
    salaryType: 'Monthly',
    basicSalary: 75000,
    otRatePerHour: 550,
    epfEligible: true,
    fingerprintId: 101,
    active: true
  },
  {
    id: 'emp-02',
    empNo: 'EMP-002',
    name: 'Nuwan Jayasinghe',
    sinhalaName: 'නුවන් ජයසිංහ',
    role: 'Lighting Technician',
    phone: '071 987 6543',
    nationalId: '199587401129',
    salaryType: 'Monthly',
    basicSalary: 62000,
    otRatePerHour: 450,
    epfEligible: true,
    fingerprintId: 102,
    active: true
  },
  {
    id: 'emp-03',
    empNo: 'EMP-003',
    name: 'Saman Kumara',
    sinhalaName: 'සමන් කුමාර',
    role: 'Vehicle Driver',
    phone: '076 554 1122',
    nationalId: '198945603310',
    salaryType: 'Monthly',
    basicSalary: 55000,
    otRatePerHour: 400,
    epfEligible: true,
    fingerprintId: 103,
    active: true
  },
  {
    id: 'emp-04',
    empNo: 'EMP-004',
    name: 'Dinesh Bandara',
    sinhalaName: 'දිනේෂ් බණ්ඩාර',
    role: 'Site Crew / Helper',
    phone: '078 332 9901',
    nationalId: '200155209931',
    salaryType: 'Daily',
    basicSalary: 2800, // per day
    otRatePerHour: 350,
    epfEligible: false,
    fingerprintId: 104,
    active: true
  }
];

// Helper to compute date strings relative to today
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
};

// Sample bookings highlighting the Multi-stage blocking logic!
// Setup Window (3-4 days prior) + Active Event + Dismantle Window (3 days afterward)
const event1Start = addDays(today, 5);
const event1End = addDays(today, 9); // 5 days event
const event1Setup = 3;
const event1Dismantle = 3;

export const initialBookings: EventBooking[] = [
  {
    id: 'evt-001',
    bookingNumber: 'LSL-EVT-2026-001',
    customerName: 'Roshan Samarasekera (Grand Wedding)',
    customerPhone: '077 789 1234',
    customerEmail: 'roshan.sam@gmail.com',
    customerAddress: 'No 45, Temple Road, Nugegoda',
    eventTitle: 'Grand Outdoor Wedding & Banquet',
    eventVenue: 'Waters Edge, Battaramulla',
    eventStartDate: formatDate(event1Start),
    eventEndDate: formatDate(event1End),
    activeEventDays: 5,
    setupDaysPrior: event1Setup,
    dismantleDaysAfter: event1Dismantle,
    blockedStartDate: formatDate(addDays(event1Start, -event1Setup)),
    blockedEndDate: formatDate(addDays(event1End, event1Dismantle)),
    status: 'Confirmed',
    items: [
      {
        itemId: 'rent-01',
        name: 'Sharpy Beam 7R Moving Head 230W',
        quantity: 12,
        dailyRate: 3500,
        totalDays: 5,
        subtotal: 210000
      },
      {
        itemId: 'rent-02',
        name: 'LED Par Light 54x3W RGBW Waterproof',
        quantity: 24,
        dailyRate: 850,
        totalDays: 5,
        subtotal: 102000
      },
      {
        itemId: 'rent-03',
        name: 'Aluminum Box Truss 10ft (300mm x 300mm)',
        quantity: 10,
        dailyRate: 2000,
        totalDays: 5,
        subtotal: 100000
      },
      {
        itemId: 'rent-07',
        name: 'Warm White Fairy / Festoon Light Canopy Set (500m)',
        quantity: 2,
        dailyRate: 15000,
        totalDays: 5,
        subtotal: 150000
      }
    ],
    equipmentTotal: 562000,
    transportCrewFee: 35000,
    securityDeposit: 50000,
    discount: 22000,
    netTotal: 625000,
    advancePaid: 300000,
    balanceDue: 325000,
    paymentMethod: 'Bank Transfer',
    notes: 'Requires 4-man setup team. Installation begins 3 days prior due to grand marquee construction.',
    createdAt: formatDate(addDays(today, -3))
  },
  {
    id: 'evt-002',
    bookingNumber: 'LSL-EVT-2026-002',
    customerName: 'St. Joseph\'s College Musical Fiesta',
    customerPhone: '071 445 6677',
    customerAddress: 'Darley Road, Colombo 10',
    eventTitle: 'Annual Inter-School Live Concert',
    eventVenue: 'Sugathadasa Indoor Stadium, Colombo',
    eventStartDate: formatDate(addDays(today, 14)),
    eventEndDate: formatDate(addDays(today, 15)),
    activeEventDays: 2,
    setupDaysPrior: 2,
    dismantleDaysAfter: 1,
    blockedStartDate: formatDate(addDays(today, 12)),
    blockedEndDate: formatDate(addDays(today, 16)),
    status: 'Quote',
    items: [
      {
        itemId: 'rent-01',
        name: 'Sharpy Beam 7R Moving Head 230W',
        quantity: 16,
        dailyRate: 3500,
        totalDays: 2,
        subtotal: 112000
      },
      {
        itemId: 'rent-04',
        name: 'Stage Blinder 4-Eye 400W COB LED',
        quantity: 8,
        dailyRate: 2500,
        totalDays: 2,
        subtotal: 40000
      },
      {
        itemId: 'rent-06',
        name: 'Antari Professional DMX Haze Machine 1500W',
        quantity: 2,
        dailyRate: 5000,
        totalDays: 2,
        subtotal: 20000
      }
    ],
    equipmentTotal: 172000,
    transportCrewFee: 25000,
    securityDeposit: 30000,
    discount: 7000,
    netTotal: 220000,
    advancePaid: 0,
    balanceDue: 220000,
    notes: 'Quotation sent. Awaiting school committee approval.',
    createdAt: formatDate(addDays(today, -1))
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'qte-001',
    quoteNumber: 'LSL-QTE-2026-001',
    customerName: 'Dilshan Wickramasinghe',
    customerPhone: '077 334 5566',
    customerAddress: 'Kandy Road, Kiribathgoda',
    eventTitle: 'Overnight Pirith Ceremony & Pinkama',
    eventVenue: 'Residence Garden, Kiribathgoda',
    eventStartDate: formatDate(addDays(today, 10)),
    eventEndDate: formatDate(addDays(today, 11)),
    setupDaysPrior: 3,
    dismantleDaysAfter: 2,
    items: [
      {
        itemId: 'rent-02',
        name: 'LED Par Light 54x3W RGBW Waterproof',
        quantity: 16,
        dailyRate: 850,
        totalDays: 2,
        subtotal: 27200
      },
      {
        itemId: 'rent-07',
        name: 'Warm White Fairy / Festoon Light Canopy Set (500m)',
        quantity: 1,
        dailyRate: 15000,
        totalDays: 2,
        subtotal: 30000
      }
    ],
    equipmentTotal: 57200,
    transportCrewFee: 12000,
    securityDeposit: 15000,
    discount: 4200,
    grandTotal: 80000,
    status: 'Sent',
    notes: 'Pirith mandapaya perimeter lighting and surrounding festoon canopy.',
    validUntil: formatDate(addDays(today, 7)),
    createdAt: formatDate(addDays(today, -2))
  }
];

export const initialLightWalOrders: LightWalOrder[] = [
  {
    id: 'lw-001',
    orderNumber: 'LSL-LW-082',
    customerName: 'Chaminda Rathnayake',
    customerPhone: '077 889 0011',
    customerAddress: 'Main Street, Maharagama',
    deliveryDate: formatDate(addDays(today, 3)),
    lengthValue: 150,
    lengthUnit: 'Feet',
    bulbSpacingInches: 18,
    calculatedBulbCount: 100,
    bulbType: 'Warm White Edison 2W',
    wireType: 'Heavy Duty Black Rubber 2x1.5mm',
    plugType: '13A British Standard',
    controllerIncluded: true,
    controllerType: '8-Function Memory Controller',
    pricingMode: 'perFoot',
    ratePerUnit: 220, // Rs. 220 per foot (includes wiring + bulbs + sockets)
    accessoriesFee: 3500,
    discount: 1500,
    grandTotal: 35000,
    advancePaid: 15000,
    balanceDue: 20000,
    status: 'In Assembly',
    workshopNotes: 'Customer requested extra 5 spare bulbs in package. Wire ends sealed with heat-shrink tubing.',
    createdAt: formatDate(addDays(today, -2))
  },
  {
    id: 'lw-002',
    orderNumber: 'LSL-LW-083',
    customerName: 'Priyantha Fernando',
    customerPhone: '071 223 9988',
    deliveryDate: formatDate(addDays(today, 6)),
    lengthValue: 300,
    lengthUnit: 'Feet',
    bulbSpacingInches: 24,
    calculatedBulbCount: 150,
    bulbType: 'Clear Warm White LED 4W',
    wireType: 'Outdoor Heavy 3-Core Grounded',
    plugType: '13A British Standard',
    controllerIncluded: false,
    pricingMode: 'bundle',
    ratePerUnit: 68000, // Bundle rate
    accessoriesFee: 4000,
    discount: 2000,
    grandTotal: 70000,
    advancePaid: 35000,
    balanceDue: 35000,
    status: 'Confirmed',
    workshopNotes: 'Used for banquet hall rooftop perimeter.',
    createdAt: formatDate(today)
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-01',
    empId: 'emp-01',
    date: formatDate(today),
    checkIn: '08:02',
    checkOut: '18:30',
    totalHours: 10.5,
    normalHours: 8.0,
    otHours: 2.5,
    lateMinutes: 2,
    status: 'Present',
    terminalSource: 'Biometric Terminal'
  },
  {
    id: 'att-02',
    empId: 'emp-02',
    date: formatDate(today),
    checkIn: '07:55',
    checkOut: '17:00',
    totalHours: 9.0,
    normalHours: 8.0,
    otHours: 1.0,
    lateMinutes: 0,
    status: 'Present',
    terminalSource: 'Biometric Terminal'
  },
  {
    id: 'att-03',
    empId: 'emp-03',
    date: formatDate(today),
    checkIn: '08:35',
    checkOut: '19:00',
    totalHours: 10.4,
    normalHours: 8.0,
    otHours: 2.4,
    lateMinutes: 35,
    status: 'Present',
    terminalSource: 'Biometric Terminal'
  },
  {
    id: 'att-04',
    empId: 'emp-04',
    date: formatDate(today),
    checkIn: '08:10',
    checkOut: '17:15',
    totalHours: 9.0,
    normalHours: 8.0,
    otHours: 1.0,
    lateMinutes: 10,
    status: 'Present',
    terminalSource: 'Biometric Terminal'
  }
];

