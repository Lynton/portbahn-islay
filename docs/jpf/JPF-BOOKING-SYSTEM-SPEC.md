# Jura Passenger Ferry — Booking System Spec

**Created:** 2026-03-18
**Status:** Scoping / Pre-build
**Author:** Lynton + Claude (Portbahn Islay project)

---

## 1. Background

Jura Passenger Ferry (JPF) currently uses FareHarbor for online bookings. FareHarbor charges commission on every transaction and provides far more functionality than JPF needs. The owner wants a simple, reliable, self-owned booking system with a mobile-friendly management interface.

**Goal:** Replace FareHarbor with a custom-built booking + payment system that JPF owns outright, integrated into a new JPF website.

---

## 2. Core Requirements

### 2.1 Customer-facing booking
- Browse available sailings by date
- Select trip, passenger count (adult/child), optional vehicle
- Pay securely via Stripe Checkout (hosted — no PCI burden)
- Receive confirmation email with booking reference
- View/manage booking via email link (cancel, amend)

### 2.2 Operator management (mobile-first)
- **View bookings** — daily manifest: who's on each sailing, contact details
- **Add sailings** — create scheduled or bespoke one-off trips (e.g. Gigha day trip)
- **Add extra runs** — quickly add sailings for busy days (fell race, music festival)
- **Amend bookings** — change date, sailing, passenger count, contact details
- **Cancel & refund** — full or partial refund via Stripe, automatic customer notification
- **Add manual bookings** — operator can book on behalf of walk-up or phone customers
- **Simple CMS** — update timetable info, announcements, seasonal messaging

### 2.3 Non-functional requirements
- **Reliability** — booking system must not double-book or lose payments
- **Mobile-first admin** — operator manages everything from phone
- **Low maintenance** — managed infrastructure, minimal ops burden
- **Handover-friendly** — simple enough for another developer to pick up

---

## 3. Proposed Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js (App Router) | Shared stack with Portbahn Islay, SSR + API routes in one project |
| **Language** | TypeScript | Type safety, fewer runtime errors |
| **Styling** | Tailwind CSS | Rapid mobile-first UI development |
| **Database** | Supabase (Postgres) | Managed, reliable, row-level security, real-time capable |
| **Payments** | Stripe Checkout + Webhooks | Industry standard, handles PCI, built-in retry logic |
| **Email** | Resend or SendGrid | Transactional emails (confirmations, cancellations) |
| **Hosting** | Vercel | Automatic deployments, edge network, 99.99% uptime SLA |
| **Auth (admin)** | Supabase Auth or NextAuth | Simple admin login, no customer accounts needed |

---

## 4. Data Model

### 4.1 Routes

```
routes
├── id              (uuid, PK)
├── name            (text — "Jura Ferry", "Gigha Day Trip")
├── origin          (text — "Craighouse")
├── destination     (text — "Tayvallich")
├── description     (text, nullable)
├── is_return       (boolean — default true)
├── created_at      (timestamptz)
└── updated_at      (timestamptz)
```

### 4.2 Trips (individual sailings)

```
trips
├── id              (uuid, PK)
├── route_id        (FK → routes)
├── type            (enum: scheduled | bespoke)
├── date            (date)
├── departure_time  (time)
├── return_time     (time, nullable)
├── capacity        (integer)
├── booked_count    (integer, default 0)
├── price_adult     (integer — pence)
├── price_child     (integer — pence)
├── price_vehicle   (integer — pence, nullable)
├── description     (text, nullable — for bespoke trips)
├── status          (enum: active | cancelled)
├── created_at      (timestamptz)
└── updated_at      (timestamptz)

CONSTRAINT: booked_count <= capacity (enforced at DB level)
```

### 4.3 Bookings

```
bookings
├── id                      (uuid, PK)
├── reference               (text, unique — human-readable e.g. "JPF-2026-0042")
├── trip_id                 (FK → trips)
├── customer_name           (text)
├── customer_email          (text)
├── customer_phone          (text, nullable)
├── adults                  (integer)
├── children                (integer, default 0)
├── vehicles                (integer, default 0)
├── total_amount            (integer — pence)
├── stripe_payment_intent_id (text, nullable)
├── stripe_session_id       (text, nullable)
├── source                  (enum: online | manual)
├── status                  (enum: confirmed | amended | cancelled | refunded)
├── notes                   (text, nullable — operator notes)
├── created_at              (timestamptz)
└── updated_at              (timestamptz)
```

Three tables. That's the whole system.

---

## 5. Key Flows

### 5.1 Customer books online

```
1. Customer selects date → sees available sailings with remaining capacity
2. Selects sailing → enters passenger details
3. Redirected to Stripe Checkout (hosted by Stripe)
4. Stripe processes payment
5. Stripe sends webhook → API creates booking record, decrements capacity
6. Confirmation email sent to customer
7. Booking appears in operator dashboard
```

### 5.2 Stripe webhook reliability

- Stripe retries failed webhooks for up to 3 days
- Every booking stores `stripe_session_id` for manual reconciliation
- Idempotency: webhook handler checks if booking already exists before creating
- Belt-and-braces: optional daily reconciliation cron (Stripe sessions vs DB records)

### 5.3 Operator cancels & refunds

```
1. Operator opens booking in admin dashboard (mobile)
2. Taps "Cancel & Refund"
3. Chooses full or partial refund
4. System calls Stripe Refunds API
5. Booking status → cancelled/refunded
6. Capacity freed on the sailing
7. Customer receives cancellation email
```

### 5.4 Operator amends booking

```
1. Operator opens booking in admin dashboard
2. Edits fields (date, passenger count, contact info)
3. If price changes:
   - Increase → Stripe creates additional charge
   - Decrease → Stripe issues partial refund
4. Booking record updated, customer notified
```

### 5.5 Operator adds extra sailing

```
1. Operator taps "Add sailing" in admin
2. Selects route, date, time, capacity, pricing
3. Trip published immediately on booking page
4. Customers can book straight away
```

---

## 6. Admin Dashboard — Key Views (mobile-first)

### Today view (default)
- Today's sailings listed chronologically
- Each sailing shows: time, route, passengers booked / capacity
- Tap sailing → passenger manifest with names, contact, vehicle info

### Calendar view
- Month view showing sailings per day
- Tap day → list of sailings
- Quick "Add sailing" button

### Bookings view
- Searchable list (by name, reference, email)
- Filter by status (confirmed, cancelled, refunded)
- Tap booking → full details + actions (amend, cancel, refund)

### Settings
- Manage routes
- Seasonal timetable templates (optional future feature)
- Announcement banner text

---

## 7. Reliability & Failsafes

| Risk | Mitigation |
|------|------------|
| Double-booking beyond capacity | Database CHECK constraint — physically impossible |
| Stripe webhook fails | Stripe auto-retries for 3 days + idempotency keys |
| Payment received but booking not created | Reconciliation via stripe_session_id |
| Site goes down | Vercel 99.99% SLA, managed infrastructure |
| Database unavailable | Supabase managed redundancy + daily backups |
| Operator error (accidental cancel) | Confirmation dialogs, refund requires explicit amount entry |
| Developer unavailable | Simple codebase (3 tables, standard patterns), documented |

---

## 8. What's NOT in scope (v1)

- Customer accounts / login (book as guest, manage via email link)
- Multi-currency (GBP only)
- Loyalty / discount codes (can add later)
- Complex recurring timetable engine (operator creates sailings manually or duplicates)
- Native mobile app (responsive web app is sufficient)
- Analytics dashboard (Stripe Dashboard provides revenue reporting)
- Multi-operator / multi-tenant (single operator system)

---

## 9. Estimated Build Phases

### Phase 1 — Foundation (Week 1-2)
- Project setup (Next.js, Supabase, Stripe)
- Database schema + row-level security
- Admin auth (operator login)
- Route + trip CRUD in admin dashboard

### Phase 2 — Booking flow (Week 2-3)
- Customer-facing sailing browser
- Stripe Checkout integration
- Webhook handler + booking creation
- Confirmation emails
- Capacity enforcement

### Phase 3 — Admin operations (Week 3-4)
- Booking management (view, search, filter)
- Amend booking flow
- Cancel & refund flow
- Daily manifest / passenger list view
- Manual booking creation

### Phase 4 — Polish & testing (Week 5-6)
- Mobile UI refinement
- End-to-end testing (booking → payment → confirmation → refund)
- Stripe test mode full walkthrough
- Edge cases (concurrent bookings, webhook failures)
- Soft launch with test bookings

### Phase 5 — Website & CMS (parallel / following)
- JPF public website (about, timetable, contact)
- Simple CMS for announcements / seasonal info
- SEO basics

---

## 10. Relationship to Portbahn Islay

JPF is a separate project but shares:
- **Tech stack** — Next.js + TypeScript + Tailwind + Vercel
- **Developer** — same team, shared knowledge
- **Potential cross-linking** — Portbahn guests are JPF customers (ferry to Jura)

The systems are **independent deployments**. JPF has its own repo, database, and Stripe account. No shared infrastructure dependencies.

---

## 11. Open Questions

1. **Pricing structure** — flat rate per passenger, or variable by route/season?
2. **Vehicle types** — just cars, or bikes/kayaks/large items too?
3. **Sailing capacity unit** — passengers only, or weight/vehicle limits?
4. **Cancellation policy** — full refund always, or time-based (e.g. 24hr+ = full, <24hr = 50%)?
5. **Operator access** — single admin, or multiple crew members with different roles?
6. **Domain** — jurapassengerferry.co.uk or similar?
7. **Go-live target** — seasonal? What month does the service start?
8. **Migration** — any existing booking data to import from FareHarbor?

---

*This spec is a living document. Update as requirements are confirmed with JPF owner.*
