-- POS & Online Ordering Schema Extension
-- Run against existing D1 database: fampam-db

-- Customer accounts (for online ordering)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  default_address TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS customers_email_idx ON customers (email);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number INTEGER,
  customer_id TEXT REFERENCES customers(id),
  guest_email TEXT,
  guest_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('pickup', 'delivery')),
  status TEXT NOT NULL DEFAULT 'received'
    CHECK (status IN ('received','preparing','ready','out_for_delivery','delivered','completed','cancelled')),
  items TEXT NOT NULL DEFAULT '[]',
  subtotal_cents INTEGER NOT NULL,
  delivery_fee_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  delivery_address TEXT,
  delivery_phone TEXT,
  delivery_notes TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);

-- Invoice records
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  invoice_number TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Auto-increment helper for order numbers
CREATE TABLE IF NOT EXISTS order_counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_number INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO order_counter (id, last_number) VALUES (1, 0);

-- Add POS settings defaults
INSERT INTO site_settings (id, key, value) VALUES
  (lower(hex(randomblob(16))), 'pos_config', '{"store_online": true, "delivery_enabled": true, "delivery_fee_cents": 350, "min_order_cents": 1500, "tax_rate": 0.19}')
ON CONFLICT (key) DO NOTHING;
