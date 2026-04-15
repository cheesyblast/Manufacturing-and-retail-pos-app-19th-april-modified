-- ERP Manufacturing & Retail Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'cashier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw Materials
CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    unit VARCHAR(50) DEFAULT 'kg',
    quantity DECIMAL(12,2) DEFAULT 0,
    unit_cost DECIMAL(12,2) DEFAULT 0,
    reorder_level DECIMAL(12,2) DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status VARCHAR(50) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    received_date TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    raw_material_id UUID REFERENCES raw_materials(id),
    raw_material_name VARCHAR(255),
    quantity DECIMAL(12,2) NOT NULL,
    unit_cost DECIMAL(12,2) NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    received_quantity DECIMAL(12,2) DEFAULT 0
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    description TEXT,
    unit_price DECIMAL(12,2) NOT NULL,
    cost_price DECIMAL(12,2) DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    location_id UUID REFERENCES locations(id),
    quantity DECIMAL(12,2) DEFAULT 0,
    min_stock_level DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, location_id)
);

-- Stock Transfers
CREATE TABLE IF NOT EXISTS stock_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    from_location_id UUID REFERENCES locations(id),
    to_location_id UUID REFERENCES locations(id),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock Transfer Items
CREATE TABLE IF NOT EXISTS stock_transfer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_id UUID REFERENCES stock_transfers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255),
    quantity DECIMAL(12,2) NOT NULL
);

-- Bill of Materials
CREATE TABLE IF NOT EXISTS bill_of_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    output_quantity DECIMAL(12,2) DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOM Items
CREATE TABLE IF NOT EXISTS bom_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bom_id UUID REFERENCES bill_of_materials(id) ON DELETE CASCADE,
    raw_material_id UUID REFERENCES raw_materials(id),
    raw_material_name VARCHAR(255),
    quantity DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'kg'
);

-- Production Orders
CREATE TABLE IF NOT EXISTS production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    bom_id UUID REFERENCES bill_of_materials(id),
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255),
    quantity_planned DECIMAL(12,2) NOT NULL,
    quantity_produced DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'planned',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location_id UUID REFERENCES locations(id),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Logs
CREATE TABLE IF NOT EXISTS production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_order_id UUID REFERENCES production_orders(id) ON DELETE CASCADE,
    logged_by UUID REFERENCES users(id),
    logged_by_name VARCHAR(255),
    quantity_produced DECIMAL(12,2) NOT NULL,
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    loyalty_points INT DEFAULT 0,
    total_purchases DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(255),
    customer_mobile VARCHAR(50),
    location_id UUID REFERENCES locations(id),
    cashier_id UUID REFERENCES users(id),
    cashier_name VARCHAR(255),
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    payment_status VARCHAR(50) DEFAULT 'paid',
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sale Items
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255),
    product_sku VARCHAR(100),
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_location ON sales(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_location ON inventory(product_id, location_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- Disable RLS for all tables (since we use custom JWT auth, not Supabase Auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for raw_materials" ON raw_materials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for purchase_orders" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for purchase_order_items" ON purchase_order_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for locations" ON locations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for products" ON products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for stock_transfers" ON stock_transfers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for stock_transfer_items" ON stock_transfer_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE bill_of_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for bill_of_materials" ON bill_of_materials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE bom_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for bom_items" ON bom_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for production_orders" ON production_orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for production_logs" ON production_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for customers" ON customers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for sales" ON sales FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for sale_items" ON sale_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for app_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);
