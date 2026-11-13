// Types for Lakshan Superlight Management System

export type BookingStatus = 'Quote' | 'Confirmed' | 'In-Setup' | 'Active-Event' | 'Dismantling' | 'Completed' | 'Cancelled';

export interface RentalItem {
  id: string;
  name: string;
  sinhalaName?: string;
  category: 'Moving Heads' | 'Par Lights' | 'Sharpy & Beams' | 'Effects & Lasers' | 'Truss & Rigging' | 'Power & Distro' | 'Sound & Audio' | 'Ambient & Decor';
  totalQuantity: number;
  maintenanceQty: number; // In repair / damaged
  dailyRate: number; // LKR per day
  replacementCost: number;
  imageUrl?: string;
  specs?: string;
}

export interface BookingItem {
  itemId: string;
  name: string;
  quantity: number;
  dailyRate: number;
  totalDays: number;
  subtotal: number;
}

export interface EventBooking {
  id: string;
  bookingNumber: string; // e.g., LSL-EVT-2026-001
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  eventTitle: string;
  eventVenue: string;
  
  // Date Lifecycle blocking
  eventStartDate: string; // YYYY-MM-DD
  eventEndDate: string; // YYYY-MM-DD
  activeEventDays: number; // e.g. 5 days
  setupDaysPrior: number; // e.g. 3-4 days
  dismantleDaysAfter: number; // e.g. 3 days
  
  // Computed full lifecycle block window
  blockedStartDate: string; // eventStartDate - setupDaysPrior
  blockedEndDate: string; // eventEndDate + dismantleDaysAfter
  
  status: BookingStatus;
  items: BookingItem[];
  
  // Financials
  equipmentTotal: number;
  transportCrewFee: number;
  securityDeposit: number; // refundable
  discount: number;
  netTotal: number;
  advancePaid: number;
  balanceDue: number;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Cheque';
  
  notes?: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string; // e.g., LSL-QTE-2026-001
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  eventTitle: string;
  eventVenue: string;
  eventStartDate: string;
  eventEndDate: string;
  setupDaysPrior: number;
  dismantleDaysAfter: number;
  items: BookingItem[];
  equipmentTotal: number;
  transportCrewFee: number;
  securityDeposit: number;
  discount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Converted';
  convertedBookingId?: string;
  notes?: string;
  validUntil: string;
  createdAt: string;
}

export interface RetailItem {
  id: string;
  sku: string;
  name: string;
  sinhalaName?: string;
  category: 'Bulbs & Lamps' | 'Wires & Cables' | 'Holders & Sockets' | 'Tapes & Accessories' | 'Power Supplies' | 'LED Strips';
  unit: 'Piece' | 'Meter' | 'Roll' | 'Box' | 'Set';
  unitCost: number;
  retailPrice: number;
  stockQty: number;
  minAlertQty: number;
}

export interface POSCartItem {
  itemId: string;
  sku: string;
  name: string;
  unit: string;
  retailPrice: number;
  quantity: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface POSTransaction {
  id: string;
  receiptNumber: string; // e.g., LSL-POS-1042
  date: string;
  customerName?: string;
  customerPhone?: string;
  items: POSCartItem[];
  subtotal: number;
  discount: number;
  netTotal: number;
  amountPaid: number;
  changeGiven: number;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer';
  cashierName: string;
}

export interface LightWalOrder {
  id: string;
  orderNumber: string; // e.g., LSL-LW-082
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryDate: string;
  
  // Light Wal custom specifications
  lengthValue: number;
  lengthUnit: 'Feet' | 'Meters';
  bulbSpacingInches: number; // e.g. 12, 18, 24 inches
  calculatedBulbCount: number;
  
  bulbType: 'Warm White Edison 2W' | 'Clear Warm White LED 4W' | 'RGB Multi-Color Flashing' | 'Milky White G40' | 'Vintage Filament Amber';
  wireType: 'Heavy Duty Black Rubber 2x1.5mm' | 'Standard PVC Black 2-Core' | 'Clear / Transparent Copper' | 'Outdoor Heavy 3-Core Grounded';
  plugType: '13A British Standard' | '15A Round Pin' | 'Standard 2-Pin Plug';
  controllerIncluded: boolean;
  controllerType?: '8-Function Memory Controller' | 'Inline Rotary Dimmer' | 'Static Non-Flashing Driver';
  
  pricingMode: 'perFoot' | 'perBulb' | 'bundle';
  ratePerUnit: number; // e.g. Rs. 180 per foot or Rs. 120 per bulb socket
  accessoriesFee: number;
  discount: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  
  status: 'Inquiry' | 'Confirmed' | 'In Assembly' | 'Ready for Pickup' | 'Delivered';
  workshopNotes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  empNo: string; // e.g., EMP-001
  name: string;
  sinhalaName?: string;
  role: 'Lighting Technician' | 'Lead Electrician' | 'Audio/Visual Tech' | 'Site Crew / Helper' | 'Vehicle Driver' | 'Supervisor';
  phone: string;
  nationalId: string;
  salaryType: 'Monthly' | 'Daily';
  basicSalary: number; // e.g. Rs. 65,000 / month or Rs. 2,800 / day
  otRatePerHour: number; // e.g. Rs. 450 / hour
  epfEligible: boolean; // 8% employee, 12% employer
  fingerprintId: number; // Terminal enrollment ID (1-1000)
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  empId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm
  checkOut?: string; // HH:mm
  totalHours: number;
  normalHours: number;
  otHours: number;
  lateMinutes: number;
  status: 'Present' | 'Half-Day' | 'Absent' | 'On-Leave' | 'Site-Duty';
  terminalSource: 'Biometric Terminal' | 'Manual Punch' | 'Imported CSV';
}

export interface PayrollRecord {
  id: string;
  payrollMonth: string; // e.g., "2026-10"
  empId: string;
  empName: string;
  role: string;
  salaryType: 'Monthly' | 'Daily';
  basicSalary: number;
  daysWorked: number;
  otHours: number;
  otEarnings: number;
  siteAllowances: number;
  grossSalary: number;
  
  // Deductions
  epfEmployee8: number;
  advanceDeductions: number;
  lateDeductions: number;
  totalDeductions: number;
  
  netSalary: number;
  
  // Employer Contributions
  epfEmployer12: number;
  etfEmployer3: number;
  
  paymentStatus: 'Pending' | 'Paid';
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer';
  payslipPrintedAt?: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: 'WhatsApp Broadcast' | 'Facebook Campaign' | 'Google Business';
  targetAudience: 'All Clients' | 'Wedding Venues' | 'Past Event Organizers' | 'Retail Customers';
  contentSnippet: string;
  clickUrl?: string;
  status: 'Active' | 'Scheduled' | 'Draft';
}

