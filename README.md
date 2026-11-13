# Lakshan Superlight & Event Productions Management System

A custom software solution engineered specifically for **Lakshan Superlight** in accordance with the **System Requirements Specification (SRS)**.

---

## 📋 Comprehensive Scope of Work Coverage

### Phase 1: Digital Marketing & Online Presence
- **1.1 Facebook-to-WhatsApp Lead Funnel (`/marketing`)**:
  - Direct click-to-chat WhatsApp link generator with pre-filled promotional templates in Sinhala and English for *Wedding Lighting*, *Light Wal*, *Concerts*, and *Pirith Pinkama*.
  - Ready for integration into Facebook Page posts, Boosted Ads, and QR codes.
- **1.2 WhatsApp Contact Broadcast & Sharing Workflow (`/marketing`)**:
  - Segments client contacts into *Event Clients*, *Light Wal Buyers*, and *Retail POS Customers*.
  - Streamlined promotional broadcast message composer with one-click clipboard copy.
- **1.3 Google Business Profile Registration & Local Search (`/marketing`)**:
  - Standardized business metadata (Name, Sinhala trade name, categories, address, hours, phone numbers).
  - Verification checklist and local SEO review link generator for Google Maps.

---

### Phase 2: Custom Software System
- **2.1 Automated Event Stock Deduction on Booking (`/rental-stock` & `/bookings`)**:
  - Real-time master catalog with category filtering (*Moving Heads*, *Par Lights*, *Truss & Rigging*, *Lasers & Effects*, *Power Distro*, *Decor*).
  - Tracks total stock, maintenance/damaged stock, currently booked units, and free available units.
  - Live overbooking prevention algorithm prevents scheduling more units than available.
- **2.2 Full-Lifecycle Event Date Blocking (`/bookings`)**:
  - **Multi-Stage Calendar Reservation Logic**: Automatically locks items across:
    1. **Pre-Event Setup Window**: 3–4 days prior (configurable).
    2. **Active Event Window**: Event duration (e.g., 5 active days).
    3. **Post-Event Dismantling Window**: 3 days afterward (configurable).
  - Total stock lock period = `[Event Start - Setup Days]` to `[Event End + Dismantle Days]`.
  - Conflict detection engine alerts if any overlapping booking exceeds available quantity.
- **2.3 Biometric Fingerprint Attendance & Automated Salary Calculation (`/payroll`)**:
  - Biometric terminal sync simulator with check-in, check-out, working hours, late arrivals, and overtime (OT) tracking.
  - Employee wage settings (Basic Salary, Hourly OT Rate, EPF/ETF eligibility, Terminal Fingerprint ID).
  - Automated Monthly Payroll Run:
    $$\text{Gross Pay} = \text{Basic Salary} + \text{OT Pay} + \text{Site Allowances}$$
    $$\text{Net Salary} = \text{Gross Pay} - (\text{EPF 8\%} + \text{Advance Deductions})$$
    $$\text{Employer Contributions} = \text{EPF 12\%} + \text{ETF 3\%}$$
  - Formatted printable employee payslips.
- **2.4 Standalone Direct Sales Software Module - POS (`/direct-sales`)**:
  - Operates completely independently from rental equipment stock.
  - Retail catalog (*E27/B22 Edison Bulbs, Rubber Wire Coils, Sockets, Top Plugs, Insulation Tapes*).
  - High-speed POS cart with cash given, change due calculator, card/bank transfer, and 80mm thermal receipt printing.
- **2.5 Quotations & Invoices Typing and Print Engine (`/quotations`)**:
  - Professional quotation and commercial invoice typing engine with customizable header, billing terms, bank details, and customer information.
  - **One-Click Conversion**: Convert any quotation to a confirmed booking in 1 click, automatically reserving stock and creating date blocks.
- **2.6 Dedicated "Light Wal" (Fairy / Festoon Lights) Invoicing Workflow (`/light-wal`)**:
  - Sizing calculator: Custom length in Feet or Meters, bulb socket spacing (12", 18", 24", 36"), and calculated bulb socket count.
  - Specifications: Bulb type (*Edison 2W, Clear LED 4W, RGB Flashing*), wire insulation (*Kelani Heavy Duty Rubber 2x1.5mm, PVC*), plug, and flasher controller.
  - Pricing engines: *Per Foot/Meter*, *Per Bulb Socket*, or *Fixed Bundle/Package*.
  - Dedicated printable Workshop Job Sheet & Commercial Invoice.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm.cmd install

# 2. Run in development mode
npm.cmd run dev

# 3. Or build and run production preview
npm.cmd run build
npm.cmd run preview -- --port 3000
```
Open **`http://localhost:3000`** in your browser.

