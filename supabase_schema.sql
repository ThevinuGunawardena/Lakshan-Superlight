-- =============================================================================
-- LAKSHAN SUPER LIGHT (PVT) LTD — ENTERPRISE CLOUD DATABASE SCHEMA
-- Compatible with Supabase / PostgreSQL
-- =============================================================================

-- 1. COMPANY INFORMATION & BRANDING
CREATE TABLE IF NOT EXISTS lsl_company_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  tagline TEXT,
  address TEXT,
  phone1 TEXT,
  phone2 TEXT,
  whatsapp TEXT,
  email TEXT,
  bank_name TEXT,
  bank_branch TEXT,
  account_number TEXT,
  account_holder TEXT,
  terms JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MASTER RENTAL EQUIPMENT FLEET
CREATE TABLE IF NOT EXISTS lsl_rental_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  maintenance_qty INTEGER NOT NULL DEFAULT 0,
  daily_rate NUMERIC NOT NULL DEFAULT 0,
  replacement_cost NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  specs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RETAIL POS INVENTORY
CREATE TABLE IF NOT EXISTS lsl_retail_items (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Piece',
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  retail_price NUMERIC NOT NULL DEFAULT 0,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  min_alert_qty INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENT BOOKINGS & MULTI-STAGE DATE BLOCKING
CREATE TABLE IF NOT EXISTS lsl_bookings (
  id TEXT PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  event_title TEXT NOT NULL,
  event_venue TEXT NOT NULL,
  event_start_date DATE NOT NULL,
  event_end_date DATE NOT NULL,
  active_event_days INTEGER NOT NULL DEFAULT 1,
  setup_days_prior INTEGER NOT NULL DEFAULT 3,
  dismantle_days_after INTEGER NOT NULL DEFAULT 3,
  blocked_start_date DATE NOT NULL,
  blocked_end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  equipment_total NUMERIC NOT NULL DEFAULT 0,
  transport_crew_fee NUMERIC NOT NULL DEFAULT 0,
  security_deposit NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  net_total NUMERIC NOT NULL DEFAULT 0,
  advance_paid NUMERIC NOT NULL DEFAULT 0,
  balance_due NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMMERCIAL ESTIMATES & QUOTATIONS
CREATE TABLE IF NOT EXISTS lsl_quotations (
  id TEXT PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  event_title TEXT NOT NULL,
  event_venue TEXT NOT NULL,
  event_start_date DATE NOT NULL,
  event_end_date DATE NOT NULL,
  setup_days_prior INTEGER NOT NULL DEFAULT 3,
  dismantle_days_after INTEGER NOT NULL DEFAULT 3,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  equipment_total NUMERIC NOT NULL DEFAULT 0,
  transport_crew_fee NUMERIC NOT NULL DEFAULT 0,
  security_deposit NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft',
  converted_booking_id TEXT,
  notes TEXT,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DEDICATED LIGHT WAL FESTOON ORDERS
CREATE TABLE IF NOT EXISTS lsl_light_wal_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  delivery_date DATE,
  length_value NUMERIC NOT NULL DEFAULT 100,
  length_unit TEXT NOT NULL DEFAULT 'Feet',
  bulb_spacing_inches INTEGER NOT NULL DEFAULT 18,
  calculated_bulb_count INTEGER NOT NULL DEFAULT 67,
  bulb_type TEXT NOT NULL,
  wire_type TEXT NOT NULL,
  plug_type TEXT NOT NULL,
  controller_included BOOLEAN NOT NULL DEFAULT false,
  controller_type TEXT,
  pricing_mode TEXT NOT NULL DEFAULT 'bundle',
  rate_per_unit NUMERIC NOT NULL DEFAULT 0,
  accessories_fee NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL DEFAULT 0,
  advance_paid NUMERIC NOT NULL DEFAULT 0,
  balance_due NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Inquiry',
  workshop_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EMPLOYEES & STAFF DIRECTORY
CREATE TABLE IF NOT EXISTS lsl_employees (
  id TEXT PRIMARY KEY,
  emp_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT NOT NULL,
  salary_type TEXT NOT NULL DEFAULT 'Monthly',
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  ot_rate_per_hour NUMERIC NOT NULL DEFAULT 0,
  epf_eligible BOOLEAN NOT NULL DEFAULT true,
  fingerprint_id INTEGER NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BIOMETRIC ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS lsl_attendance (
  id TEXT PRIMARY KEY,
  emp_id TEXT NOT NULL REFERENCES lsl_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME NOT NULL,
  check_out TIME,
  total_hours NUMERIC NOT NULL DEFAULT 0,
  normal_hours NUMERIC NOT NULL DEFAULT 0,
  ot_hours NUMERIC NOT NULL DEFAULT 0,
  late_minutes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Present',
  terminal_source TEXT NOT NULL DEFAULT 'Biometric Terminal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PAYROLL DISBURSEMENTS & SLIPS
CREATE TABLE IF NOT EXISTS lsl_payroll (
  id TEXT PRIMARY KEY,
  payroll_month TEXT NOT NULL,
  emp_id TEXT NOT NULL REFERENCES lsl_employees(id) ON DELETE CASCADE,
  emp_name TEXT NOT NULL,
  role TEXT NOT NULL,
  salary_type TEXT NOT NULL,
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  days_worked NUMERIC NOT NULL DEFAULT 0,
  ot_hours NUMERIC NOT NULL DEFAULT 0,
  ot_pay NUMERIC NOT NULL DEFAULT 0,
  allowances NUMERIC NOT NULL DEFAULT 0,
  gross_pay NUMERIC NOT NULL DEFAULT 0,
  epf_employee NUMERIC NOT NULL DEFAULT 0,
  advances_deducted NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  epf_employer NUMERIC NOT NULL DEFAULT 0,
  etf_employer NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft',
  disbursed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. POINT OF SALE (POS) TRANSACTIONS
CREATE TABLE IF NOT EXISTS lsl_pos_transactions (
  id TEXT PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  customer_name TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  net_total NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  change_given NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  cashier_name TEXT NOT NULL DEFAULT 'Admin'
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- =============================================================================

ALTER TABLE lsl_company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_retail_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_light_wal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsl_pos_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON lsl_company_info FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_rental_items FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_retail_items FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_bookings FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_quotations FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_light_wal_orders FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_employees FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_attendance FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_payroll FOR ALL USING (true);
CREATE POLICY "Public Read All" ON lsl_pos_transactions FOR ALL USING (true);

-- Insert Default Company Profile
INSERT INTO lsl_company_info (id, name, tagline, address, phone1, phone2, whatsapp, email, bank_name, bank_branch, account_number, account_holder)
VALUES (
  'default',
  'Lakshan Super Light (Pvt) Ltd',
  'Professional Stage Lighting, Light Wal Rentals & Sales',
  'No. 142/B, High Level Road, Maharagama, Sri Lanka',
  '+94 77 123 4567',
  '+94 11 289 9000',
  '+94771234567',
  'info@lakshansuperlight.lk',
  'Commercial Bank of Ceylon',
  'Maharagama Super Branch',
  '800 124 5590',
  'Lakshan Super Light (Pvt) Ltd'
) ON CONFLICT (id) DO NOTHING;
