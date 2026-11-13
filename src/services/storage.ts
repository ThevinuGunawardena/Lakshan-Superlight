import {
  RentalItem,
  RetailItem,
  EventBooking,
  Quotation,
  LightWalOrder,
  Employee,
  AttendanceRecord,
  PayrollRecord,
  POSTransaction
} from '../types';
import {
  initialRentalItems,
  initialRetailItems,
  initialEmployees,
  initialBookings,
  initialQuotations,
  initialLightWalOrders,
  initialAttendanceRecords
} from './mockData';

const STORAGE_KEYS = {
  RENTAL_ITEMS: 'lsl_rental_items',
  RETAIL_ITEMS: 'lsl_retail_items',
  BOOKINGS: 'lsl_bookings',
  QUOTATIONS: 'lsl_quotations',
  LIGHT_WAL_ORDERS: 'lsl_light_wal_orders',
  EMPLOYEES: 'lsl_employees',
  ATTENDANCE: 'lsl_attendance',
  PAYROLL: 'lsl_payroll',
  POS_TRANSACTIONS: 'lsl_pos_transactions',
  COMPANY_INFO: 'lsl_company_info'
};

export interface CompanyInfo {
  name: string;
  tagline: string;
  sinhalaName: string;
  address: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  accountHolder: string;
  terms: string[];
}

export const defaultCompanyInfo: CompanyInfo = {
  name: 'Lakshan Superlight & Event Productions',
  tagline: 'Professional Stage Lighting, Light Wal Rentals & Sales',
  sinhalaName: 'ලක්ෂාන් සුපර්ලයිට් සහ ඉවෙන්ට් ප්‍රඩක්ෂන්ස්',
  address: 'No. 142/B, High Level Road, Maharagama, Sri Lanka',
  phone1: '+94 77 123 4567',
  phone2: '+94 11 289 9000',
  whatsapp: '+94771234567',
  email: 'info@lakshansuperlight.lk',
  bankName: 'Commercial Bank of Ceylon',
  bankBranch: 'Maharagama Super Branch',
  accountNumber: '800 124 5590',
  accountHolder: 'Lakshan Superlight Productions',
  terms: [
    '30% non-refundable advance required to confirm booking and lock equipment dates.',
    'Equipment blocked strictly includes pre-event setup (3-4 days) & post-event dismantling (3 days).',
    'Customer is responsible for safe on-site storage, 3-phase power supply, and sheltered shelter from rain.',
    'Any damages or missing gear will be charged at current replacement cost.'
  ]
};

// Generic safe storage loader
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Rental Items
  getRentalItems: (): RentalItem[] => getStored(STORAGE_KEYS.RENTAL_ITEMS, initialRentalItems),
  saveRentalItems: (items: RentalItem[]) => setStored(STORAGE_KEYS.RENTAL_ITEMS, items),
  addRentalItem: (item: RentalItem) => {
    const items = StorageService.getRentalItems();
    items.unshift(item);
    StorageService.saveRentalItems(items);
    return items;
  },
  updateRentalItem: (updated: RentalItem) => {
    const items = StorageService.getRentalItems().map(i => i.id === updated.id ? updated : i);
    StorageService.saveRentalItems(items);
    return items;
  },

  // Retail Items (Direct Sales)
  getRetailItems: (): RetailItem[] => getStored(STORAGE_KEYS.RETAIL_ITEMS, initialRetailItems),
  saveRetailItems: (items: RetailItem[]) => setStored(STORAGE_KEYS.RETAIL_ITEMS, items),
  updateRetailStock: (itemId: string, qtySold: number) => {
    const items = StorageService.getRetailItems().map(i => {
      if (i.id === itemId) {
        return { ...i, stockQty: Math.max(0, i.stockQty - qtySold) };
      }
      return i;
    });
    StorageService.saveRetailItems(items);
    return items;
  },

  // Event Bookings
  getBookings: (): EventBooking[] => getStored(STORAGE_KEYS.BOOKINGS, initialBookings),
  saveBookings: (bookings: EventBooking[]) => setStored(STORAGE_KEYS.BOOKINGS, bookings),
  addBooking: (booking: EventBooking) => {
    const bookings = StorageService.getBookings();
    bookings.unshift(booking);
    StorageService.saveBookings(bookings);
    return bookings;
  },
  updateBooking: (updated: EventBooking) => {
    const bookings = StorageService.getBookings().map(b => b.id === updated.id ? updated : b);
    StorageService.saveBookings(bookings);
    return bookings;
  },

  // Quotations
  getQuotations: (): Quotation[] => getStored(STORAGE_KEYS.QUOTATIONS, initialQuotations),
  saveQuotations: (quotes: Quotation[]) => setStored(STORAGE_KEYS.QUOTATIONS, quotes),
  addQuotation: (quote: Quotation) => {
    const quotes = StorageService.getQuotations();
    quotes.unshift(quote);
    StorageService.saveQuotations(quotes);
    return quotes;
  },
  updateQuotation: (updated: Quotation) => {
    const quotes = StorageService.getQuotations().map(q => q.id === updated.id ? updated : q);
    StorageService.saveQuotations(quotes);
    return quotes;
  },

  // Light Wal Orders
  getLightWalOrders: (): LightWalOrder[] => getStored(STORAGE_KEYS.LIGHT_WAL_ORDERS, initialLightWalOrders),
  saveLightWalOrders: (orders: LightWalOrder[]) => setStored(STORAGE_KEYS.LIGHT_WAL_ORDERS, orders),
  addLightWalOrder: (order: LightWalOrder) => {
    const orders = StorageService.getLightWalOrders();
    orders.unshift(order);
    StorageService.saveLightWalOrders(orders);
    return orders;
  },
  updateLightWalOrder: (updated: LightWalOrder) => {
    const orders = StorageService.getLightWalOrders().map(o => o.id === updated.id ? updated : o);
    StorageService.saveLightWalOrders(orders);
    return orders;
  },

  // POS Transactions
  getPOSTransactions: (): POSTransaction[] => getStored(STORAGE_KEYS.POS_TRANSACTIONS, []),
  savePOSTransactions: (txs: POSTransaction[]) => setStored(STORAGE_KEYS.POS_TRANSACTIONS, txs),
  recordPOSSale: (tx: POSTransaction) => {
    const txs = StorageService.getPOSTransactions();
    txs.unshift(tx);
    StorageService.savePOSTransactions(txs);
    // Deduct stock
    tx.items.forEach(item => {
      StorageService.updateRetailStock(item.itemId, item.quantity);
    });
    return txs;
  },

  // Employees
  getEmployees: (): Employee[] => getStored(STORAGE_KEYS.EMPLOYEES, initialEmployees),
  saveEmployees: (emps: Employee[]) => setStored(STORAGE_KEYS.EMPLOYEES, emps),

  // Attendance
  getAttendance: (): AttendanceRecord[] => getStored(STORAGE_KEYS.ATTENDANCE, initialAttendanceRecords),
  saveAttendance: (records: AttendanceRecord[]) => setStored(STORAGE_KEYS.ATTENDANCE, records),
  logBiometricPunch: (record: AttendanceRecord) => {
    const records = StorageService.getAttendance();
    records.unshift(record);
    StorageService.saveAttendance(records);
    return records;
  },

  // Payroll
  getPayroll: (): PayrollRecord[] => getStored(STORAGE_KEYS.PAYROLL, []),
  savePayroll: (payroll: PayrollRecord[]) => setStored(STORAGE_KEYS.PAYROLL, payroll),

  // Company Info
  getCompanyInfo: (): CompanyInfo => getStored(STORAGE_KEYS.COMPANY_INFO, defaultCompanyInfo),
  saveCompanyInfo: (info: CompanyInfo) => setStored(STORAGE_KEYS.COMPANY_INFO, info),

  // ==========================================
  // CORE BUSINESS LOGIC (PDF 2.1 & 2.2):
  // Date Blocking & Overbooking Prevention
  // ==========================================
  /**
   * Checks if an item is available for the entire blocked lifecycle
   * [blockedStart to blockedEnd] = [EventStart - SetupDays to EventEnd + DismantleDays]
   */
  checkItemAvailability: (
    itemId: string,
    blockedStart: string,
    blockedEnd: string,
    requestedQty: number,
    excludeBookingId?: string
  ): {
    available: boolean;
    maxBookedQty: number;
    availableQty: number;
    totalStock: number;
    conflictingBookings: { bookingNumber: string; customerName: string; blockedStart: string; blockedEnd: string; qty: number }[];
  } => {
    const items = StorageService.getRentalItems();
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) {
      return { available: false, maxBookedQty: 0, availableQty: 0, totalStock: 0, conflictingBookings: [] };
    }

    const netStock = targetItem.totalQuantity - targetItem.maintenanceQty;
    const bookings = StorageService.getBookings().filter(b => 
      b.id !== excludeBookingId &&
      b.status !== 'Cancelled' &&
      b.status !== 'Completed'
    );

    const bStart = new Date(blockedStart).getTime();
    const bEnd = new Date(blockedEnd).getTime();

    const conflictingBookings: { bookingNumber: string; customerName: string; blockedStart: string; blockedEnd: string; qty: number }[] = [];
    let maxSimultaneousBooked = 0;

    // Check each booking overlapping with this window
    for (const b of bookings) {
      const existingStart = new Date(b.blockedStartDate).getTime();
      const existingEnd = new Date(b.blockedEndDate).getTime();

      // Check date interval overlap: start1 <= end2 && end1 >= start2
      if (bStart <= existingEnd && bEnd >= existingStart) {
        const itemLine = b.items.find(line => line.itemId === itemId);
        if (itemLine) {
          conflictingBookings.push({
            bookingNumber: b.bookingNumber,
            customerName: b.customerName,
            blockedStart: b.blockedStartDate,
            blockedEnd: b.blockedEndDate,
            qty: itemLine.quantity
          });
          maxSimultaneousBooked += itemLine.quantity;
        }
      }
    }

    const availableQty = Math.max(0, netStock - maxSimultaneousBooked);
    const available = availableQty >= requestedQty;

    return {
      available,
      maxBookedQty: maxSimultaneousBooked,
      availableQty,
      totalStock: netStock,
      conflictingBookings
    };
  },

  // Get current inventory usage right now (today)
  getCurrentRentalUsage: () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTime = new Date(todayStr).getTime();
    const items = StorageService.getRentalItems();
    const bookings = StorageService.getBookings().filter(b => 
      b.status !== 'Cancelled' && b.status !== 'Completed'
    );

    return items.map(item => {
      let currentlyBooked = 0;
      bookings.forEach(b => {
        const bStart = new Date(b.blockedStartDate).getTime();
        const bEnd = new Date(b.blockedEndDate).getTime();
        if (todayTime >= bStart && todayTime <= bEnd) {
          const line = b.items.find(l => l.itemId === item.id);
          if (line) currentlyBooked += line.quantity;
        }
      });

      const freeStock = Math.max(0, item.totalQuantity - item.maintenanceQty - currentlyBooked);
      return {
        item,
        total: item.totalQuantity,
        maintenance: item.maintenanceQty,
        currentlyBooked,
        freeStock
      };
    });
  },

  // Export / Backup full database
  exportBackupJSON: () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      rentalItems: StorageService.getRentalItems(),
      retailItems: StorageService.getRetailItems(),
      bookings: StorageService.getBookings(),
      quotations: StorageService.getQuotations(),
      lightWalOrders: StorageService.getLightWalOrders(),
      employees: StorageService.getEmployees(),
      attendance: StorageService.getAttendance(),
      payroll: StorageService.getPayroll(),
      posTransactions: StorageService.getPOSTransactions(),
      companyInfo: StorageService.getCompanyInfo()
    };
    return JSON.stringify(backup, null, 2);
  },

  // Reset to sample initial state
  resetToDefaults: () => {
    localStorage.clear();
    StorageService.saveRentalItems(initialRentalItems);
    StorageService.saveRetailItems(initialRetailItems);
    StorageService.saveBookings(initialBookings);
    StorageService.saveQuotations(initialQuotations);
    StorageService.saveLightWalOrders(initialLightWalOrders);
    StorageService.saveEmployees(initialEmployees);
    StorageService.saveAttendance(initialAttendanceRecords);
    StorageService.saveCompanyInfo(defaultCompanyInfo);
  }
};

