# TextileERP - Manufacturing & Retail ERP with POS

## Original Problem Statement
Build a full-stack manufacturing and retail ERP with POS using a Supabase relational database. Flow: Purchasing (Thread imports) → Manufacturing (Fabric/Clothing production) → Inventory (Factory/Sorting/Outlets) → Sales & POS. Accounting module with Revenue, COGS, Expenses, Daily Sales Report, Income Statements and Balance Sheet.

## Architecture
- **Backend**: FastAPI (Python) + supabase-py client
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons
- **Database**: Supabase (PostgreSQL) - 13 relational tables
- **Auth**: Custom JWT with bcrypt password hashing
- **Design**: Quiet Luxury aesthetic (beige/navy tones), Cabinet Grotesk + Manrope fonts

## User Personas
1. **Admin** - Full access: accounting, balance sheets, user management, all modules
2. **Production Staff** - Manufacturing logs, inventory management, dashboard
3. **Cashier** - POS, products, dashboard

## Core Requirements
- Purchasing: Supplier management, raw materials, purchase orders with receive flow
- Manufacturing: Bill of Materials (BOM), production orders, production logging
- Inventory: Multi-location tracking (Factory/Sorting/Outlets), stock transfers
- POS: Product search, barcode scan, customer registration by mobile, multiple payment methods, receipt generation
- Accounting: Daily Sales Report, Income Statement, Balance Sheet, expense tracking
- Settings: Business details, SMS/Email config placeholders

## What's Been Implemented (April 15, 2026)
- [x] 13 Supabase tables with indexes and RLS policies
- [x] JWT auth with role-based access (admin, production_staff, cashier)
- [x] Admin seeding on startup
- [x] Full Purchasing module (suppliers, raw materials, POs)
- [x] Full Manufacturing module (BOMs, production orders, logging)
- [x] Full Inventory module (multi-location, stock transfers)
- [x] Full POS module (search, cart, checkout, receipts)
- [x] Full Accounting module (daily sales, income statement, balance sheet)
- [x] User management, Settings page
- [x] Quiet Luxury UI with beige/navy theme
- [x] Setup page with migration SQL for new deployments
- [x] 100% backend tests passing (24/24)

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (High)
- notify.lk SMS integration for digital receipts
- Email SMTP integration for notifications
- Barcode label printing

### P2 (Medium)
- Customer loyalty program features
- Advanced reporting (charts/graphs with Recharts)
- Stock alerts/notifications
- Multi-currency support
- Export reports to PDF/Excel
- Audit trail for transactions
