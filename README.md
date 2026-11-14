# Lakshan Superlight - Event Productions & Operational Management System

A unified operational management system engineered specifically for **Lakshan Superlight & Event Productions**.

---

## 🚀 Key Modules & System Capabilities

### 1. Operations Dashboard
- **Real-Time Operational Metrics**: Live status of active bookings, in-field rental equipment, today's staff attendance, POS sales revenue, and open quotes.
- **Multi-Stage Event Lifecycle Visualizer**: Visual schedule tracking each event across its pre-event staging window, active show dates, and post-event return period.
- **Quick Action Center**: 1-click navigation to create event bookings, launch retail POS checkout, calculate custom Light Wal orders, or run biometric payroll.

---

### 2. Event Bookings & Multi-Stage Date Blocking Engine
- **Full Lifecycle Automated Equipment Locking**:
  1. **Pre-Event Staging**: Configurable buffer (e.g. 3–4 days) for warehouse packing, testing, loading, transport, and on-site rigging.
  2. **Active Show Days**: Full operational show schedule.
  3. **Post-Event Dismantle & Return**: Dedicated buffer (e.g. 3 days) for breakdown, cable coiling, warehouse intake, inspection, and servicing.
- **Total Block Span**: Automatically locks equipment across `[Event Start - Setup Days]` through `[Event End + Dismantle Days]`.
- **Zero-Conflict Overbooking Shield**: Real-time conflict validation against total fleet minus damaged/servicing stock. System visually alerts if overlapping bookings exceed available quantity.
- **Stage Crew & Vehicle Assignment**: Assign lead technician, crew members, and transport logistics directly to bookings.

---

### 3. Master Rental Equipment Catalog
- **Master Fleet Management**: Categorized tracking across *Moving Heads*, *LED Par Lights*, *Truss & Rigging*, *Lasers & Atmospheric Effects*, *Power Distribution*, and *Decor Lighting*.
- **Live Status Tracking**: Instant visibility of total units, units currently in field, units in maintenance/repair, and true available stock.
- **Schedule Inspector**: Open any fixture's calendar to see past, present, and upcoming event allocations.

---

### 4. Dedicated "Light Wal" (Festoon & Fairy Lights) Engineering Engine
- **Custom Dimension Calculator**: Input total length in Feet or Meters and select bulb spacing (12", 18", 24", 36") to calculate exact socket counts automatically.
- **Technical Specifications**: Configurable bulb types (*Edison Warm Filament 2W, Clear LED 4W, RGB Flashing*), cable grades (*Kelani Heavy Duty Rubber 2x1.5mm, Weatherproof PVC*), plugs, and controller flasher units.
- **Flexible Commercial Pricing**: Calculate by *Per Foot/Meter*, *Per Socket*, or *Fixed Package Deal*.
- **Workshop Job Sheets**: 1-click printable technical production sheets for workshop assembly technicians detailing wire length, sockets, spacing, and packaging.

---

### 5. Standalone Direct Sales Point of Sale (POS)
- **Independent Retail Inventory**: Retail stock (E27 Edison bulbs, socket holders, heavy-duty wire coils, plugs, insulation tapes) completely segregated from rental gear.
- **High-Speed Counter Cart**: Barcode/SKU quick-search, instant quantity controls, and rapid line-item discounts.
- **Split Tender & Change Computation**: Instant cash received calculation with real-time change due, credit/debit card, or direct bank transfer support.
- **80mm Thermal Receipt Printing**: Clean, receipt layout ready for thermal printers.

---

### 6. Commercial Quotations & Invoices Engine
- **Professional Invoice & Estimate Generator**: Itemized equipment, labor, transport, and staging terms with customizable company header and payment instructions.
- **One-Click Quote-to-Booking Conversion**: Convert approved client estimates into confirmed active bookings instantly, automatically generating calendar reservations and locking equipment in the warehouse.
- **Print & PDF Export**: Clean, standard A4 commercial format with printable company seal, terms, and bank details.

---

### 7. Biometric Fingerprint Attendance & Automated Payroll
- **Biometric Terminal Synchronization**: Terminal sync logger tracking employee punch-in, punch-out, hours worked, late flags, and overtime (OT) hours.
- **Automated Salary Calculation**:
  - $$\text{Gross Pay} = \text{Basic Salary} + \text{OT Pay} + \text{Site Allowances}$$
  - $$\text{Net Salary} = \text{Gross Pay} - (\text{EPF 8\%} + \text{Salary Advance Deductions})$$
  - $$\text{Employer Contributions} = \text{EPF 12\%} + \text{ETF 3\%}$$
- **Payslip Generator**: Formatted printable payslips for every staff member.

---

### 8. Lead Funnel & Marketing Hub
- **Direct WhatsApp Lead Funnel**: Instant click-to-chat link generator with custom inquiry templates for *Wedding Lighting*, *Light Wal*, *Concerts & Staging*, and *Cultural / Religious Events*.
- **Segmented WhatsApp Broadcast**: Filter customer contacts by *Event Organizers*, *Festoon Light Buyers*, or *Retail POS Customers* and compose targeted broadcast messages.
- **Google Business Profile & Local Search Guide**: Verification checklist and review link launcher to maximize local search rank on Google Maps.

---

### 9. Settings, Customization & Data Backup
- **Company Profile**: Customize company name, business registration number, primary phone numbers, email, warehouse address, and bank settlement details.
- **JSON Data Backup & Restore**: Full 1-click database export to JSON file and instant restore capability for offline security and multi-machine sync.

---

### 10. Cloud Database & Multi-Device Synchronization (Supabase)
- **Central PostgreSQL Cloud Database**: Connect free Supabase cloud database to allow real-time multi-device sync across office PCs, warehouse tablets, and mobile phones.
- **Offline-First Hybrid Persistence**: Instant optimistic UI with local fallback if internet disconnects, automatically writing to cloud when connected.
- **1-Click SQL Setup**: Automated schema file `supabase_schema.sql` included in root for instant 1-click table setup.
- **In-App Credential Management**: Enter Supabase URL and Key directly in the UI under **Settings ➜ Cloud Database** or via `.env` file.

---

## ☁️ Web Hosting & Cloud Setup Guide

### 1. Free Cloud Database Setup (Supabase)
1. Create a free account at [supabase.com](https://supabase.com) and click **New Project**.
2. Go to the **SQL Editor** tab on the left, copy the contents of **`supabase_schema.sql`** in this project, and click **Run**.
3. In Supabase, go to **Project Settings ➜ API**, copy your **Project URL** and **anon public API key**.
4. In the Lakshan Superlight web app, open **Settings & Company ➜ Cloud Database**, paste the URL and Key, and click **Save Cloud Credentials**.
5. Click **Push Local Data to Cloud** to upload all existing mock/demo equipment and bookings into the cloud!

### 2. Deploying to Free Web Hosting (Vercel or Netlify)
- **Vercel**: Import the GitHub repository `ThevinuGunawardena/Lakshan-Superlight`, add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and click **Deploy**.
- **Netlify**: Connect your GitHub repository, set build command `npm run build` and publish directory `dist`.

### Launching with the Windows 1-Click Launcher
Double-click **`Run-Lakshan-Superlight.bat`** in the application directory.
This script will start the application and automatically open your default web browser to:
```
http://localhost:3000/
```

### Running Manually via Command Line
```powershell
# 1. Install project dependencies (if not already installed)
npm.cmd install

# 2. Start the local server
npm.cmd run preview -- --port 3000
```
Open **`http://localhost:3000`** in your browser.
To access from mobile devices or other computers on your local Wi-Fi / LAN, use the Network IP address displayed in the terminal (e.g. `http://192.168.1.7:3000`).
