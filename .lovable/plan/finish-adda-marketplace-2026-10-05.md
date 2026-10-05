# Finish ADDA marketplace

## Goal
Complete the remaining marketplace flows and make each screen feel intentional on phones, tablets, laptops, and wide desktops. Remove the customer-facing English/Nepali switch and keep the site English-only.

## Storefront polish
- Remove the floating and inline language controls while preserving English content editing in Admin.
- Rework the homepage banner, category rows, product grids, navigation, and sale sections at mobile, tablet, and desktop breakpoints.
- Fix image cropping, text overlap, touch targets, tables, drawers, and bottom navigation.
- Remove remaining old-brand labels and ensure ADDA artwork, metadata, social preview, install icons, and sale imagery remain consistent.

## Seller features
- Turn seller registration into a real signed-in application saved for admin review.
- Add a seller-only guard and a practical Seller Center with overview, orders, earnings, products, stock, and shop settings.
- Let approved sellers create, edit, hide, and delete only products belonging to their own shop.
- Show application status clearly for pending or rejected shops.

## Admin features
- Add Sellers to the platform dashboard with pending approvals, approve/reject actions, commission rate, shop visibility, and seller details.
- Expand dashboard summaries to include shops, pending applications, marketplace sales, commissions, and low stock.
- Keep platform products and orders manageable across all shops, with seller/shop context visible.

## Multi-seller commerce
- Attach each order item to its seller and shop at checkout.
- Create seller order records grouped from one customer checkout, each with independent fulfillment status, subtotal, commission, and seller payout amount.
- Let sellers view and update only their own fulfillment records; let admins manage all records and payout status.
- Preserve the customer’s single checkout and order view while showing per-shop fulfillment progress.

## Technical details
- Add secure database policies and grants for seller applications, shop ownership, seller products, seller orders, and payouts.
- Keep roles in the dedicated roles table; seller access is validated from approved shop ownership, never browser storage.
- Update generated app-facing types through the backend type source after schema changes.
- Verify builds and test the main storefront plus seller/admin flows in authenticated preview sessions where available.
- Check layouts at representative phone, tablet, desktop, and wide-screen widths.
