# `admin-erp.html` - Structural Mirror

## 1. CSS Styles (`<style>`)
* `/* ── ERP LAYOUT ── */`: Grid, sidebar, topbar definitions.
* `/* ── INVOICE FORM ── */`: Grid layouts for line items.
* `/* ── A4 PRINT TEMPLATE ── */`: Hidden CSS solely for PDF generation.

## 2. UI Shell (`<body>`)
* `<div id="auth-overlay">`: The loading screen.
* `<aside class="erp-sidebar">`: The left navigation menu.
* `<div class="erp-main">`: The right-side workspace.

## 3. The Pages (Hidden/Shown via JS)
* `<div id="page-dashboard">`: Stats, Quick Actions, Pending Offline Sync.
* `<div id="page-invoice">`: Invoice form + "All Invoices" table.
* `<div id="page-quotation">`: Quotation list (uses Invoice form for creation).
* `<div id="page-challan">`: Delivery Challan form + list.
* `<div id="page-purchase">`: Purchase Bill form + list.
* `<div id="page-payment">`: Receipt form (calculates balance) + list.
* `<div id="page-reports">`: Ledger generation and P&L.
* `<div id="page-settings">`: Company details, PDF template toggles, HSN manager.

## 4. Hidden Components
* `<div id="printTemplate">`: The DOM structure injected into `html2pdf.js`.
* `<div id="portalPushModal">`: The popup asking to push to the client dashboard.

## 5. JavaScript (`<script type="module">`)
* **Imports:** Firebase + `ds-firebase.js`.
* **State:** `currentDocType`, `lineItems`, `isOnline`.
* **Boot Sequence:** `auth.authStateReady()` -> `bootERP(user)`.
* **Form Logic:** `addLineItem()`, `recalcTotals()`.
* **Database Logic:** `saveInvoice()`, `syncOfflineInvoices()`.
* **PDF Logic:** `buildPrintTemplate()`, `downloadPDF()`.
* **Loaders:** `loadAllInvoices()`, `generatePartyLedger()`.
