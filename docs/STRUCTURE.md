# Arena — Project Structure Guide

This document explains how the codebase is organized today and the recommended cleanup path.

## Current layout (simplified)

```
src/
├── config/           ← Platform-wide constants (pricing, commissions)
├── core/             ← Shared types, permissions, route access rules
├── layout/           ← App chrome (Header, Sidebar, RightSidebar)
├── layouts/          ← MainLayout + route shell  ⚠️ merge into layout/
├── pages/            ← 2 orphan pages (Feed, Video)  ⚠️ move to users/pages/
├── users/pages/      ← Most user-facing screens
├── users/pages/settings/  ← All settings (user + tipster mixed)
├── dashboard/        ← Tipster dashboard (active)
├── tipsters/         ← Orphan DashboardPage  ⚠️ delete or merge
├── admin/            ← Admin dashboard + pricing
├── auth/             ← Login, signup, OTP
├── components/       ← Shared UI, cards, modals
├── services/         ← API clients per domain
├── api/              ← Express mock backend
└── database/models/  ← In-memory data models
```

## Role-based mental model

| Role    | Where to look |
|---------|----------------|
| User    | `users/pages/`, `components/` |
| Tipster | `dashboard/tipster/`, `users/pages/BecomeTipsterPage`, `users/pages/settings/` (tipster routes) |
| Admin   | `admin/`, `config/platformPricing.ts` |

## Pricing & commissions (single source of truth)

All platform fees live in **`src/config/platformPricing.ts`**:

- Tipster registration fee (one-time)
- Subscription commission %
- Prediction commission %
- Payout processing fee %
- Min / max / default VIP channel prices

**Admin edits:** `/admin/pricing` → `admin/pages/PlatformPricingPage.tsx`  
**API:** `GET /api/platform/pricing` (public), `PUT /api/admin/platform-pricing` (admin)  
**Service:** `services/pricing/PlatformPricingService.ts`

Do **not** hardcode `2500`, `15%`, etc. in pages — import from config or fetch via the service.

## Recommended cleanup (incremental, no big rewrite)

### Phase 1 — Quick wins (done / in progress)
- [x] Central `config/platformPricing.ts`
- [x] Admin pricing page at `/admin/pricing`
- [ ] Delete `src/tipsters/pages/DashboardPage.tsx` (unused duplicate)
- [ ] Move `layouts/MainLayout.tsx` → `layout/MainLayout.tsx`

### Phase 2 — Feature folders
```
src/features/
  user/pages/          ← Home, Profile, Wallet, etc.
  tipster/pages/       ← BecomeTipster, TipsterDashboard
  tipster/settings/    ← channels, pricing, payout, members
  admin/pages/         ← AdminDashboard, PlatformPricing
```

Keep **URLs unchanged** — only move files and fix imports.

### Phase 3 — Settings split
- `features/user/settings/` — account, privacy, security, display
- `features/tipster/settings/` — channels, members, subscription pricing, payout

`SettingsRoutes.tsx` already composes by role; split files to match.

### Naming fixes
- `Matchdetailpage.tsx` → `MatchDetailPage.tsx`
- One `PredictionCard` only (`components/cards/`)
- Route or remove unused `ExplorePage.tsx`

## Where to add new code

| Adding… | Put it in… |
|---------|------------|
| New user page | `users/pages/` (or `features/user/pages/` after Phase 2) |
| Tipster-only screen | `dashboard/tipster/` or `users/pages/settings/` |
| Admin tool | `admin/pages/` + route in `admin/AdminRoutes.tsx` |
| Platform fee / commission | `config/platformPricing.ts` + admin pricing page |
| Shared UI | `components/` |
| API endpoint | `api/server.ts` + matching `services/*` |

## Routing hub

All in-app routes are declared in **`layouts/MainLayout.tsx`** (moving to `layout/MainLayout.tsx`).

Admin sub-routes: **`admin/AdminRoutes.tsx`** (`/admin`, `/admin/pricing`).

Settings sub-routes: **`users/pages/settings/SettingsRoutes.tsx`**.
