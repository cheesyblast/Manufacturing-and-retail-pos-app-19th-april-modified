# TextileERP - Manufacturing & Retail ERP with POS

## Original Problem Statement
Build a full-stack manufacturing and retail ERP with POS using Supabase relational database. Flow: Purchasing → Manufacturing → Inventory → Sales & POS. Accounting module with Revenue, COGS, Expenses, Daily Sales Report, Income Statements and Balance Sheet.

## Architecture
- **Backend**: FastAPI (Python) + supabase-py client
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons
- **Database**: Supabase (PostgreSQL) - 18 relational tables
- **Auth**: Custom JWT with bcrypt password hashing
- **Design**: Quiet Luxury aesthetic (beige/navy), Cabinet Grotesk + Manrope fonts

## What's Been Implemented

### V1 (April 15, 2026)
- 13 core Supabase tables with indexes and RLS
- JWT auth with role-based access (admin, production_staff, cashier)
- Full Purchasing, Manufacturing, Inventory, POS, Accounting modules
- Quiet Luxury UI

### V2 (April 15, 2026)
- Performance: Server-side pagination, in-memory caching, debounced search
- Brand Management: Logo upload, dynamic sidebar/receipt branding
- Manual Transactions: Income/expense recording with custom categories (12 defaults)
- Print Receipts: 80mm thermal printer CSS, amount tendered, change due
- Bulk Import: CSV templates + upload with SKU validation for Products & Inventory
- Custom Orders: Full module with status tracking, partial payments, unearned revenue accounting
- Income Statement: POS Sales + Manual Income + Custom Order Payments - COGS - Expenses
- Balance Sheet: Assets, Liabilities (Unearned Revenue), Equity
- Hidden Emergent branding for white-label

## Prioritized Backlog
### P1
- notify.lk SMS integration for receipts & custom order notifications
- WhatsApp Business API for "Ready for Pickup" messages
- Barcode label printing
### P2
- Recharts dashboard analytics
- Customer loyalty tiers
- Multi-currency support
- Export reports to PDF/Excel
