# ERP SaaS - Manufacturing & Retail ERP with POS

## Original Problem Statement
Build a SaaS-ready full-stack manufacturing and retail ERP with POS using Supabase relational database. The system must support multi-tenant deployment with a first-time setup wizard, white-label branding, and automatic database provisioning.

## Architecture
- **Backend**: FastAPI (Python) + supabase-py + psycopg2 (direct DB for migrations)
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons + Recharts
- **Database**: Supabase (PostgreSQL) - 25+ relational tables
- **Auth**: Custom JWT with bcrypt password hashing
- **Design**: Quiet Luxury aesthetic (beige/navy)
- **Migration Framework**: Auto-run on startup via Supabase RPC exec_sql()
- **SaaS Model**: Setup wizard for per-instance configuration, .env-based config storage

## What's Been Implemented

### V1 (April 15, 2026)
- 18 core Supabase tables with indexes and RLS
- JWT auth with role-based access (admin, production_staff, cashier)
- Full Purchasing, Manufacturing, Inventory, POS, Accounting modules
- Quiet Luxury UI

### V2 (April 15, 2026)
- Performance: Server-side pagination, in-memory caching, debounced search
- Brand Management: Logo upload, dynamic sidebar/receipt branding
- Manual Transactions: Income/expense recording with custom categories
- Print Receipts: 80mm thermal printer CSS
- Bulk Import: CSV templates + upload with SKU validation
- Custom Orders: Full module with status tracking, partial payments
- Income Statement & Balance Sheet

### V3 (April 17, 2026)
- Auto Migration Framework (6 versioned migrations, database-agnostic)
- Multi-Location Support (location_id on users, expenses, transactions)
- Product Attributes & Variants (dynamic: Color, Batch, Size, etc.)
- Tax & Compliance (Sri Lanka 2026): VAT 18%, SSCL 2.5%, global toggle
- Purchasing Landed Cost (global charges, unit landed price)
- Manufacturing Wastage (BOM wastage %, auto-adjusted inventory)
- Shift Reconciliation (open/close shifts, petty cash, discrepancy flagging)
- Dashboard Analytics (Recharts: Line/Pie/Bar, Profit Center filter)

### V4 — SaaS (April 17, 2026)
- **Setup Wizard** (/setup): Detects fresh install, collects Supabase credentials, auto-creates exec_sql, runs all migrations, creates admin
- **White-Label Branding**: Dynamic business name in title, sidebar, login, receipts. No hardcoded product names.
- **Setup Guard**: /setup/initialize blocked once SETUP_COMPLETE=true. Middleware blocks API access until configured.
- **Dynamic Config**: .env-based per-instance configuration. Fresh deploy → wizard → new client.
- **Email Config UI**: Settings tab for SMTP (Forgot Password ready when SMTP configured)
- **Sidebar Brand Caching**: localStorage cache to eliminate flash of default name

## Database Tables (25+)
users, suppliers, raw_materials, purchase_orders, purchase_order_items, locations, products, inventory, stock_transfers, stock_transfer_items, bill_of_materials, bom_items, production_orders, production_logs, customers, sales, sale_items, payments, expenses, app_settings, manual_transactions, transaction_categories, custom_orders, custom_order_items, custom_order_payments, product_attributes, product_variants, product_variant_attributes, shift_records, petty_cash, _migrations

## Prioritized Backlog
### P1
- Location-based access filtering (auto-filter POS/inventory by user's assigned outlet)
- Forgot Password / Reset Password flow using SMTP settings

### P2
- SMS/WhatsApp notifications (notify.lk)
- Barcode label printing
- Customer loyalty tiers
- Multi-currency support
- Export reports to PDF/Excel
- Weighted Average Cost recalculation on PO receive
